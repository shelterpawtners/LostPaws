# Branch retirement manifest — 2026-09-12

Executed after PR #131 merged to `main`. Every branch below was retired from `origin`, with the exact commit it pointed at. Nothing is lost — restore any entry with:

```
git branch <name> <sha>
git push origin <name>
```

A branch qualified only if its content added nothing to `main` (`git diff main...branch` empty) or GitHub reports its pull request as merged. Branches with unique unmerged work were left in place and are listed at the end.

## Retired

| Branch                                        | Commit                                     | Last commit |
| --------------------------------------------- | ------------------------------------------ | ----------- |
| `build/festival-mvp`                          | `ad3845d305fcce16b21de4346d60a9212c5e76e5` | 2026-09-08  |
| `data-architecture/deal-moments`              | `b7edca7ff023efb7923c9a567f38f06f63be6bb1` | 2026-09-10  |
| `data-architecture/pet-media-guardian-feed`   | `f3464c532650e00b47c3ac09a60464919b6c4372` | 2026-09-10  |
| `design/brand-propagation`                    | `16e35907cf6cca1e367964aebd90ba5a1c8fcafa` | 2026-09-09  |
| `design/marketplace-concepts`                 | `0d0566fe0d5a31eab9648eb04aa7e77d3984c749` | 2026-09-09  |
| `docs/cutover-configuration-complete`         | `c22969fdcc2accd77d38b8077c44125f4b0605f2` | 2026-09-11  |
| `docs/issue-119-cutover-attempt`              | `00d7964304b2b3d26bd4179d63d73f0410312fe0` | 2026-09-11  |
| `docs/launch-handoff-sync-125`                | `24ed617a52a9df02dd4b5460baf6899fb6ede2f5` | 2026-09-12  |
| `docs/legal-owner-review-checklist`           | `676b5d5288a8d368e1945cb8cfa65b38aeb35c1f` | 2026-09-11  |
| `docs/reconcile-guardian-launch-readiness`    | `ba8e02cf4572b470c53ea7de85ed459feb9e7d41` | 2026-09-11  |
| `docs/reconcile-launch-readiness-20260911`    | `cfe94db48b5b80435adb9f78e413a208971d6f83` | 2026-09-11  |
| `docs/support-os-domain-runbooks`             | `0788e1c6a42f6345a8fff78d1ebc7acd9ed6e51b` | 2026-09-11  |
| `docs/support-os-mvp-runbooks`                | `8dd0095924b8bcbbaa5f51c9898f4c4a574bf00e` | 2026-09-11  |
| `feat/guardian-avatar-profile`                | `32a13c52b3d7e9cb40bb8788bde8f4de93434b36` | 2026-09-11  |
| `feat/issue-53-guardian-account-menu`         | `2b5093a238d57299f721b6901feab88b7a78303e` | 2026-09-11  |
| `feat/lostpaws-landing-shell`                 | `8a27e4911d5e7b92265a6acc3a2422afbaf0b95b` | 2026-09-11  |
| `feat/rave-vendor-acquisition-clean`          | `cda57a7d5773b4efc105d1a68487e1d2d083fd43` | 2026-09-11  |
| `feat/support-classification-owner-digest`    | `ce45a5e6350ea0a1296dc5742c46802294522858` | 2026-09-11  |
| `feat/support-delivery-contract-aging`        | `bd29d31c810079f01e5643e2a55da6d9f4b13b8b` | 2026-09-11  |
| `feat/support-release-context`                | `96370a90d95fe0b6169a309b8dc76a2b495c5699` | 2026-09-11  |
| `feat/support-triage-digest-foundation`       | `72c3a410c220b2a18b0ec73d3fa7205eddefa56d` | 2026-09-11  |
| `feat/support-triage-queue`                   | `9479ea5494af41515cbedc48102e2ff097cd0525` | 2026-09-11  |
| `feature/dual-marketplace-events`             | `f318bcbf65a1c8c0421855f4f027498b6d178f48` | 2026-09-12  |
| `fix/disable-meta-auth`                       | `48c7c8692e5920dbd88f3a922d300b2c7fa4b76b` | 2026-09-11  |
| `fix/enable-google-auth-pages`                | `e7f6188e07998cf682bedddf808caf69f4e78f98` | 2026-09-11  |
| `fix/github-pages-brand-paths`                | `45b3e7fbc91818684d2ebdabeb57c719ab04626e` | 2026-09-11  |
| `fix/github-pages-browser-smoke`              | `f52fd033e54cab3e567e2ff20f2c6f6e2e2b73ef` | 2026-09-11  |
| `fix/github-pages-live-smoke`                 | `5e21b0324884de808665ab5d885bc3829d1fd1c3` | 2026-09-11  |
| `fix/github-pages-verifier-quote`             | `6d8fafdd28fb006cabdf37273f7adc3d8c2e0958` | 2026-09-11  |
| `fix/guardian-pet-contact-fields`             | `287511f4909bf15471066c02ce1c0f2f16649d46` | 2026-09-11  |
| `fix/issue-108-public-profile-demo-isolation` | `5599ae6f65af02da6b0430602d9892eb84e9df13` | 2026-09-11  |
| `fix/issue-109-anon-org-read-hardening`       | `035ee674c57054291ae2eb62c39ff7aa01f2c36a` | 2026-09-11  |
| `fix/issue-116-support-delivery-claim`        | `59e14b17c519a7d4e2689036d13144296899ee24` | 2026-09-11  |
| `fix/issue-125-rave-lostpaws-mobile`          | `c8a4b15b69ad1552b4837decaf89be8370e5544b` | 2026-09-12  |
| `fix/issue-53-guardian-pet-contact-fields-v2` | `02f59c85cef8e0b9d57ae71b92d9533c64a7f68f` | 2026-09-11  |
| `fix/issue-98-facebook-frontend`              | `96b7b4eac47ed7d9fdc9296e7bb4e07e02a44dd2` | 2026-09-11  |
| `fix/issue-99-oauth-base-aware`               | `64bf9382d56dc76ae843f5fb746e2a0a44395d9b` | 2026-09-11  |
| `fix/launch-docs-format`                      | `aa8e402be5215b3e2bcae0dd92feb62500dba97e` | 2026-09-12  |
| `fix/launch-security-hardening-current-main`  | `d5b68fc82eca4e142d26d87cb85a17c5122f4ae8` | 2026-09-11  |
| `fix/pages-live-mission-assertion`            | `c86dd34d3a037ff7010c077b857bc483f5feab53` | 2026-09-11  |
| `fix/support-fingerprint-search-path-main`    | `50929d49f5392766753e6c8bf869e4485e9cc7fa` | 2026-09-11  |
| `fix/vercel-ignore-build-no-jq`               | `dc26c37e06813a35253b76b962584a1bedcf1af8` | 2026-09-11  |
| `infra/github-pages-staging`                  | `2e3af970fa5ac507cc324340992dd4888706aa6c` | 2026-09-11  |
| `issue-56-password-recovery-readiness`        | `0c72c9efd7833fe25cf96064aeaf84dbda2a7cf8` | 2026-09-11  |
| `issue-56-support-delivery-runtime`           | `9cf91ca3e38ed38ab5dd20551dfca262d176e4b3` | 2026-09-11  |
| `issue-87-mobile-auth-smoke`                  | `509f0add66db2a5fa96c2d071e8bfab84bb4abdf` | 2026-09-11  |
| `launch/issue-119-legal-route-shells`         | `7de02351227f793de7ad7fcc0b4e5361f5844cdc` | 2026-09-11  |
| `launch/issue-119-meta-legal-routes`          | `e35d391ada10019af740ea4507e27996c1581fd8` | 2026-09-11  |
| `launch/marketplace-density-53-v2`            | `b5b7807002f75d1e681cd7d67c8144b5193c8f4a` | 2026-09-10  |
| `launch/pre-cutover-readiness`                | `1196eb5b61933f76d194e715e5e3274333a4e73e` | 2026-09-10  |
| `ops/db-qa-delta-routing`                     | `b34f6846b2d73ab3832e2fa8e46739f74b9b3be4` | 2026-09-08  |
| `ops/dev-loop-v2`                             | `eec9cd9451bf114ac2089c0d7b6efaa487b91996` | 2026-09-08  |
| `ops/launch-pipeline-simplification`          | `485fc183d4860645973b0a9a0482d38f2023c10d` | 2026-09-11  |
| `ops/stream1-copilot-design-tooling`          | `e00077a728345219abe93ac8cf49405c6448fe7e` | 2026-09-09  |
| `ops/stream2-chatgpt-operator`                | `c0c4220bf81ef3fc8efd242609190605b00a1e1f` | 2026-09-09  |
| `ops/stream3-design-qa`                       | `5612cfd937a5f9a54c8ce391126c3989ce886890` | 2026-09-09  |
| `phase2/cp6-impact-giving`                    | `80584ae91589e497d6ccb1ba127b19564cf1c72c` | 2026-09-08  |
| `phase3/auth-email-readiness`                 | `fcc61bc6e55e592bd98f37a87283b97f898dde32` | 2026-09-10  |
| `phase3/guardian-passport-foundation`         | `8c0c8267055866562395e056314acdcc4624cbf8` | 2026-09-10  |
| `phase3/ll6-launch-readiness`                 | `bd778bbb65ed564df326354d92b900124f14bed2` | 2026-09-10  |
| `phase3/marketplace-polish`                   | `6bc6af76f340604916e392173eb9b40ffbbc7987` | 2026-09-10  |
| `phase3/meta-social-login`                    | `898c245ffdde7398b17405eef70639dbab2bacb1` | 2026-09-10  |
| `phase3/shelter-verification`                 | `7d36b54a6e36b0e31bbe5d84b283542278a5fd4b` | 2026-09-10  |
| `qa/guardian-registration-personas`           | `7c5ba1a385fa6f88bf72a6201c0543f5409d58e0` | 2026-09-08  |
| `qa/issue5-full-site-audit`                   | `5407cd03d37208965e85346475aaf3f0e20c6db2` | 2026-09-09  |
| `qa/pages-authenticated-guardian-acceptance`  | `c096a201c3b77caf3b6f268d90708c9678c2fe27` | 2026-09-11  |
| `qa/pages-final-mvp-acceptance`               | `25558ebc2d6542ec0e18eb6461622c542bbc604e` | 2026-09-11  |
| `support/help-feedback-intake`                | `a55ae09d7cb3f87715fa7e3050e892b7723156ce` | 2026-09-11  |
| `support/mvp-support-os`                      | `d1a5a6d715d8cccd6848d796fd253e0de2dbe179` | 2026-09-10  |
| `ux/global-nav-lostpaws-home`                 | `e0972f3332ca3f653e437778d017543f2319700e` | 2026-09-11  |
| `ux/guardian-passport-photo-forward`          | `ff5ace30698ca3946525b5e4b806ededf09c9f8d` | 2026-09-11  |
| `ux/issue-100-unified-rave-mission`           | `45dbb1409688da0a492429252081e551fdd29359` | 2026-09-11  |
| `ux/marketplace-density-slice`                | `50f328f0d50f30b3bd78dc70064a094dea451da7` | 2026-09-10  |

## Kept for your review

These hold content not in `main` and no merged pull request. Whether that content is still wanted is a judgement about intent, not something a diff settles.

| Branch                                         | Adds (files) | Last commit |
| ---------------------------------------------- | ------------ | ----------- |
| `docs/controller-handoff-2026-09-11-rave-live` | 1            | 2026-09-11  |
| `docs/issue-125-launch-handoff`                | 2            | 2026-09-12  |
| `feat/rave-vendor-acquisition`                 | 3            | 2026-09-10  |
| `fix/issue-96-canonical-lostpaws`              | 2            | 2026-09-11  |
| `fix/support-fingerprint-search-path`          | 2            | 2026-09-11  |
| `issue-58-lostpaws`                            | 3            | 2026-09-10  |
| `issue-87-final-mvp-reconciliation`            | 4            | 2026-09-11  |
| `issue-87-final-reconciliation-docs`           | 3            | 2026-09-11  |
| `launch/ux-polish-53`                          | 4            | 2026-09-10  |
| `phase3/passport-foundation`                   | 2            | 2026-09-10  |
| `qa/pages-mobile-guardian-menu-smoke`          | 1            | 2026-09-11  |
| `ux/guardian-marketplace-launch-polish`        | 1            | 2026-09-10  |
