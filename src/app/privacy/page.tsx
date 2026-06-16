import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout, Section } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — RateWala",
  description: "How RateWala collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Last updated: June 16, 2026"
    >
      <p className="text-foreground">
        RateWala (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This
        policy explains what information we collect when you use{" "}
        <a href="https://ratewala.vercel.app" className="font-medium text-teal hover:underline">
          ratewala.vercel.app
        </a>{" "}
        and related services, and how we use it.
      </p>

      <Section title="Information we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Account information:</strong> name, email address,
            and password when you sign up or sign in.
          </li>
          <li>
            <strong className="text-foreground">Business listings:</strong> shop name, address,
            phone, WhatsApp number, descriptions, menu items, prices, photos, and categories you
            submit as a business owner.
          </li>
          <li>
            <strong className="text-foreground">Reviews:</strong> ratings, comments, and display
            name when you leave a review while logged in.
          </li>
          <li>
            <strong className="text-foreground">Usage data:</strong> basic technical information
            such as browser type, device, and pages visited, collected automatically to keep the
            service secure and reliable.
          </li>
        </ul>
      </Section>

      <Section title="How we use your information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide and improve the RateWala platform</li>
          <li>Let business owners manage their listings and price lists</li>
          <li>Display public business pages, menus, and reviews</li>
          <li>Authenticate users and protect accounts</li>
          <li>Respond to support requests and fix technical issues</li>
        </ul>
      </Section>

      <Section title="How we store data">
        <p>
          RateWala uses{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal hover:underline"
          >
            Supabase
          </a>{" "}
          to store account data, business listings, products, reviews, and uploaded images. Data is
          hosted on secure cloud infrastructure. Passwords are handled by Supabase Auth and are not
          stored in plain text by RateWala.
        </p>
      </Section>

      <Section title="What is public">
        <p>
          Business names, addresses, phone numbers, menu prices, photos, and reviews are visible to
          visitors of the site. Do not post information you do not want to be public. Your email
          address and password are not shown publicly.
        </p>
      </Section>

      <Section title="Cookies & local storage">
        <p>
          We use cookies and similar technologies to keep you signed in and remember your session.
          You can control cookies through your browser settings, but some features may not work
          correctly if cookies are disabled.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>We rely on trusted third parties to operate RateWala, including:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Supabase (database, authentication, file storage)</li>
          <li>Vercel (website hosting)</li>
          <li>WhatsApp links (when you contact a business, you leave RateWala)</li>
        </ul>
        <p>
          These services have their own privacy policies. We do not sell your personal information
          to advertisers.
        </p>
      </Section>

      <Section title="Your choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>You can update or delete your business listing from your dashboard.</li>
          <li>You can edit or remove your reviews while signed in.</li>
          <li>
            You may request account deletion by emailing{" "}
            <a href="mailto:hello@ratewala.pk" className="font-medium text-teal hover:underline">
              hello@ratewala.pk
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="Children">
        <p>
          RateWala is not directed at children under 13. We do not knowingly collect personal
          information from children.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated date. Continued use of RateWala after changes means you accept the revised
          policy.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          For privacy questions or requests, contact us at{" "}
          <a href="mailto:hello@ratewala.pk" className="font-medium text-teal hover:underline">
            hello@ratewala.pk
          </a>
          . Learn more about us on our{" "}
          <Link href="/about" className="font-medium text-teal hover:underline">
            About page
          </Link>
          .
        </p>
      </Section>
    </StaticPageLayout>
  );
}
