<template>
  <main class="privacy">
    <div class="privacy__container">
      <header class="privacy__header">
        <h1 class="privacy__title">Privacy Policy</h1>
        <p class="privacy__updated">Last updated: April 2026</p>
      </header>

      <section class="privacy__section">
        <h2>Who we are</h2>
        <p>
          This website is operated by <strong>CarolineCrafts</strong>
          (<em>itscarolinecrafts.com</em>). If you have any questions about this
          policy, you can contact us via the
          <RouterLink to="/contact">contact page</RouterLink>.
        </p>
      </section>

      <section class="privacy__section">
        <h2>What data we collect</h2>
        <p>
          We only collect data when you <strong>explicitly consent</strong> to
          analytics cookies. If you accept analytics cookies, we record the
          following information each time you visit a page:
        </p>
        <ul>
          <li>The page path you visited (e.g. <code>/products</code>)</li>
          <li>
            The domain that referred you here (e.g.
            <code>google.com</code>) — or nothing if you typed the address
            directly
          </li>
          <li>
            Your device type (desktop, mobile, or tablet) — determined from your
            browser's user-agent string
          </li>
          <li>
            A random session ID generated fresh in your browser each session —
            this is never linked to your identity
          </li>
          <li>The date and time of the visit</li>
          <li>
            Your browser's user-agent string — a technical identifier your
            browser sends automatically, used only for diagnosing data quality
            issues; it is not used to identify you
          </li>
        </ul>
        <p>
          We do <strong>not</strong> collect your name, email address, IP
          address, or any other personally identifying information through our
          analytics.
        </p>
      </section>

      <section class="privacy__section">
        <h2>Why we collect it</h2>
        <p>
          Analytics data helps us understand which pages are popular, where our
          visitors come from, and what devices they use — so we can improve the
          site and create content our audience will enjoy. We process this data
          on the basis of your <strong>consent</strong>
          (Article 6(1)(a) GDPR).
        </p>
      </section>

      <section class="privacy__section">
        <h2>How it is stored</h2>
        <p>
          Analytics data is stored securely in
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            >Supabase</a
          >, a cloud database platform. Supabase acts as a data processor on our
          behalf and processes data in accordance with GDPR. You can review
          Supabase's data processing terms at
          <a
            href="https://supabase.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >supabase.com/privacy</a
          >. Access to the data is restricted — only the site owner can read it.
        </p>
      </section>

      <section class="privacy__section">
        <h2>How long we keep it</h2>
        <p>
          We retain analytics records for up to <strong>12 months</strong>. This
          period is our own policy choice, selected to allow year-on-year
          comparisons while keeping data to the minimum necessary (Article
          5(1)(e) GDPR — storage limitation).
        </p>
      </section>

      <section class="privacy__section">
        <h2>Cookies and local storage</h2>
        <p>
          We store your cookie preferences in your browser's
          <code>localStorage</code> under the key <code>cc_consent</code>. This
          is a strictly necessary operation — it prevents the consent popup from
          appearing on every page load. No tracking takes place until you
          consent to analytics cookies.
        </p>
        <p>
          If you accept analytics, a random session identifier is also stored in
          <code>sessionStorage</code> for the duration of your browser session;
          it is automatically deleted when you close the tab or browser.
        </p>
      </section>

      <section class="privacy__section">
        <h2>Third-party services</h2>
        <p>
          Our products are sold on <strong>Amazon</strong>. When you click a
          product link you leave this website and are subject to Amazon's own
          privacy policy. We do not receive any data about purchases made on
          Amazon.
        </p>
        <p>
          This site uses
          <a
            href="https://fonts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            >Google Fonts</a
          >
          to load the Nunito, Playfair Display, and Caveat typefaces. When your
          browser downloads these fonts, Google may log your IP address. See
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            >Google's privacy policy</a
          >
          for details.
        </p>
      </section>

      <section class="privacy__section">
        <h2>Your rights</h2>
        <p>Under the GDPR (and equivalent UK law) you have the right to:</p>
        <ul>
          <li>
            <strong>Withdraw consent</strong> at any time — either contact us
            via the <RouterLink to="/contact">contact page</RouterLink>, or open
            your browser's developer tools, go to Application → Local Storage,
            and delete the <code>cc_consent</code> key. The consent popup will
            reappear on your next visit.
          </li>
          <li><strong>Access</strong> any personal data we hold about you.</li>
          <li>
            <strong>Erasure</strong> — request that we delete any records
            associated with your session IDs.
          </li>
          <li>
            <strong>Restriction of processing</strong> — ask us to stop using
            your data while a dispute is resolved.
          </li>
          <li>
            <strong>Data portability</strong> — receive a copy of your data in a
            structured, machine-readable format.
          </li>
          <li>
            <strong>Lodge a complaint</strong> with your national supervisory
            authority (e.g. the ICO in the UK, or your local DPA in the EU).
          </li>
        </ul>
        <p>
          To exercise any of these rights, please use our
          <RouterLink to="/contact">contact page</RouterLink>.
        </p>
      </section>

      <section class="privacy__section">
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. When we do, the "Last
          updated" date at the top of this page will change. We encourage you to
          check back occasionally.
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.privacy {
  padding: 96px 24px 96px;
  background: var(--pink-bg);
  min-height: 100vh;
}

.privacy__container {
  max-width: 720px;
  margin: 0 auto;
}

.privacy__header {
  margin-bottom: 40px;
  border-bottom: 2px solid var(--pinktone);
  padding-bottom: 24px;
}

.privacy__title {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  color: var(--dark);
  margin-bottom: 8px;
}

.privacy__updated {
  font-size: 0.85rem;
  color: var(--mid);
}

.privacy__section {
  margin-bottom: 36px;
}

.privacy__section h2 {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--primrose-deep);
  margin-bottom: 10px;
}

.privacy__section p {
  font-size: 0.93rem;
  color: var(--dark);
  line-height: 1.75;
  margin-bottom: 10px;
}

.privacy__section ul {
  margin: 8px 0 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.privacy__section li {
  font-size: 0.91rem;
  color: var(--dark);
  line-height: 1.65;
}

.privacy__section a,
.privacy__section :deep(a) {
  color: var(--primrose-deep);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1.5px dashed var(--pinktone);
  transition: color var(--transition);
}

.privacy__section a:hover {
  color: var(--dark);
}

code {
  background: var(--primrose-light);
  color: var(--primrose-deep);
  border-radius: 5px;
  padding: 1px 6px;
  font-size: 0.86em;
  font-family: ui-monospace, monospace;
}
</style>
