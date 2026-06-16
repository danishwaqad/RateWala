"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StarRatingDisplay, StarRatingInput, StarRatingReadonly } from "@/components/star-rating-input";
import { useTranslation } from "@/components/locale-toggle";
import { formatRelativeDate } from "@/lib/utils";
import type { VendorReview } from "@/types/database";

interface VendorReviewsProps {
  vendorId: string;
  vendorSlug: string;
  averageRating: number;
  reviewCount: number;
  isOwner: boolean;
  initialReviews: VendorReview[];
}

function getAuthorName(user: { user_metadata?: { full_name?: string }; email?: string }) {
  const fullName = user.user_metadata?.full_name?.trim();
  if (fullName) return fullName;
  const email = user.email?.split("@")[0];
  return email || "User";
}

export function VendorReviews({
  vendorId,
  vendorSlug,
  averageRating,
  reviewCount,
  isOwner,
  initialReviews,
}: VendorReviewsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      setLoadingAuth(false);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const existing = reviews.find((r) => r.user_id === userId);
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [userId, reviews]);

  const myReview = reviews.find((r) => r.user_id === userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) return;
    if (comment.trim().length < 5) {
      setError(t("reviewCommentMin"));
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitting(false);
      setError(t("loginRequired"));
      return;
    }

    const payload = {
      vendor_id: vendorId,
      user_id: user.id,
      rating,
      comment: comment.trim(),
      author_name: getAuthorName(user),
    };

    const { data, error: upsertError } = await supabase
      .from("vendor_reviews")
      .upsert(payload, { onConflict: "vendor_id,user_id" })
      .select("*")
      .single();

    setSubmitting(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    if (data) {
      setReviews((prev) => {
        const withoutMine = prev.filter((r) => r.user_id !== user.id);
        return [data as VendorReview, ...withoutMine];
      });
    }

    setSuccess(myReview ? t("reviewUpdated") : t("reviewSubmitted"));
    router.refresh();
  };

  const handleDelete = async () => {
    if (!userId || !myReview) return;

    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("vendor_reviews")
      .delete()
      .eq("id", myReview.id)
      .eq("user_id", userId);

    setSubmitting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setReviews((prev) => prev.filter((r) => r.id !== myReview.id));
    setRating(5);
    setComment("");
    setSuccess(t("reviewDeleted"));
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-lg">{t("reviews")}</h3>
            <p className="text-sm text-muted-foreground">{t("reviewsSubtitle")}</p>
          </div>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <StarRatingDisplay rating={averageRating} size="md" />
              <span className="text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? t("reviewSingular") : t("reviewPlural")})
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("noReviewsYet")}</p>
          )}
        </div>
      </div>

      {!loadingAuth && !isOwner && (
        <div className="rounded-lg border p-5 md:p-6 space-y-4">
          {!userId ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-muted-foreground">{t("loginToRate")}</p>
              <Button asChild>
                <Link href={`/login?next=/vendor/${vendorSlug}`}>{t("login")}</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h4 className="font-medium">
                  {myReview ? t("editYourReview") : t("submitReview")}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{t("rateLoginOnly")}</p>
              </div>

              <div className="space-y-2">
                <Label>{t("yourRating")}</Label>
                <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewComment">{t("yourComment")}</Label>
                <textarea
                  id="reviewComment"
                  rows={4}
                  required
                  minLength={5}
                  maxLength={1000}
                  disabled={submitting}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder={t("reviewCommentPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
                  {success}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button type="submit" loading={submitting}>
                  {myReview ? t("updateReview") : t("submitReview")}
                </Button>
                {myReview && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    className="text-red-600 hover:text-red-700"
                    onClick={handleDelete}
                  >
                    {t("deleteReview")}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed px-4 py-3">
          {t("cannotRateOwnBusiness")}
        </p>
      )}

      {reviews.length > 0 ? (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium">{review.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(review.created_at)}
                    {review.updated_at !== review.created_at && ` · ${t("edited")}`}
                  </p>
                </div>
                <StarRatingReadonly rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !isOwner &&
        userId && (
          <p className="text-center text-sm text-muted-foreground py-6 border rounded-lg border-dashed">
            {t("beFirstToReview")}
          </p>
        )
      )}
    </div>
  );
}
