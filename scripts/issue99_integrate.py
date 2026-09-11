from pathlib import Path

path = Path("src/main.tsx")
text = path.read_text()

anchor = '''import {
  passwordRecoveryRedirectUrl,
  passwordUpdateStatus,
  recoveryRequestStatus,
} from "./lib/auth-recovery";
'''
addition = anchor + 'import { oauthReturnUrl } from "./lib/auth-oauth";\n'
if 'import { oauthReturnUrl } from "./lib/auth-oauth";' not in text:
    if anchor not in text:
        raise SystemExit("auth recovery import anchor not found")
    text = text.replace(anchor, addition, 1)

signup_old = 'options: { redirectTo: `${location.origin}/onboarding/${c.kind}` },'
signup_new = '''options: {
        redirectTo: oauthReturnUrl(
          location.origin,
          import.meta.env.BASE_URL,
          `onboarding/${c.kind}`,
        ),
      },'''
if signup_old in text:
    text = text.replace(signup_old, signup_new, 1)
elif 'oauthReturnUrl(' not in text or '`onboarding/${c.kind}`' not in text:
    raise SystemExit("Google signup redirect anchor not found")

login_old = 'options: { redirectTo: location.origin },'
login_new = '''options: {
        redirectTo: oauthReturnUrl(location.origin, import.meta.env.BASE_URL),
      },'''
if login_old in text:
    text = text.replace(login_old, login_new, 1)
elif 'redirectTo: oauthReturnUrl(location.origin, import.meta.env.BASE_URL)' not in text:
    raise SystemExit("Google login redirect anchor not found")

path.write_text(text)
