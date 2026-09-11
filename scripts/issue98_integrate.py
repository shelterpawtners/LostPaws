from pathlib import Path

path = Path("src/main.tsx")
text = path.read_text()

old_import = '''  adminSupabase,
  getActingSupabase,
  googleAuthEnabled,
  restoreActingSupabase,
'''
new_import = '''  adminSupabase,
  facebookAuthEnabled,
  getActingSupabase,
  googleAuthEnabled,
  restoreActingSupabase,
'''
if old_import in text:
    text = text.replace(old_import, new_import, 1)
elif "facebookAuthEnabled" not in text:
    raise SystemExit("Supabase auth import anchor not found")

signup_google_end = '''    if (error) setStatus(error.message);
  }
  const I = icons[c.kind];
'''
signup_facebook = '''    if (error) setStatus(error.message);
  }
  async function facebook() {
    if (!db)
      return setStatus(
        "The development connection will be added during deployment.",
      );
    localStorage.setItem("sp_kind", c.kind);
    const { error } = await db.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: oauthReturnUrl(
          location.origin,
          import.meta.env.BASE_URL,
          `onboarding/${c.kind}`,
        ),
      },
    });
    if (error)
      setStatus("Facebook sign-in couldn't start. Please try again.");
  }
  const I = icons[c.kind];
'''
if signup_google_end in text:
    text = text.replace(signup_google_end, signup_facebook, 1)
elif 'provider: "facebook"' not in text:
    raise SystemExit("Signup Facebook function anchor not found")

signup_google_button = '''        <button
          className="btn quiet full"
          type="button"
          onClick={google}
          disabled={!googleAuthEnabled}
        >
          {googleAuthEnabled
            ? "Continue with Google"
            : "Google sign-in coming soon"}
        </button>
        <hr />
'''
signup_buttons = '''        <button
          className="btn quiet full"
          type="button"
          onClick={google}
          disabled={!googleAuthEnabled}
        >
          {googleAuthEnabled
            ? "Continue with Google"
            : "Google sign-in coming soon"}
        </button>
        <button
          className="btn quiet full"
          type="button"
          onClick={facebook}
          disabled={!facebookAuthEnabled}
        >
          {facebookAuthEnabled
            ? "Continue with Facebook"
            : "Facebook sign-in coming soon"}
        </button>
        <hr />
'''
if signup_google_button in text:
    text = text.replace(signup_google_button, signup_buttons, 1)
elif 'Facebook sign-in coming soon' not in text:
    raise SystemExit("Signup social button anchor not found")

login_google_end = '''    if (error) setStatus(error.message);
  }
  return (
    <Page>
'''
login_facebook = '''    if (error) setStatus(error.message);
  }
  async function facebook() {
    if (!db) return setStatus("Development connection is unavailable.");
    const { error } = await db.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: oauthReturnUrl(location.origin, import.meta.env.BASE_URL),
      },
    });
    if (error)
      setStatus("Facebook sign-in couldn't start. Please try again.");
  }
  return (
    <Page>
'''
# Replace only the Login google function occurrence by searching after function Login.
login_index = text.find("function Login()")
if login_index < 0:
    raise SystemExit("Login function not found")
head, tail = text[:login_index], text[login_index:]
if login_google_end in tail:
    tail = tail.replace(login_google_end, login_facebook, 1)
elif 'provider: "facebook"' not in tail:
    raise SystemExit("Login Facebook function anchor not found")
text = head + tail

login_google_button = '''            <button
              className="btn quiet full"
              type="button"
              onClick={google}
              disabled={!googleAuthEnabled}
            >
              {googleAuthEnabled
                ? "Continue with Google"
                : "Google sign-in coming soon"}
            </button>
            <hr />
'''
login_buttons = '''            <button
              className="btn quiet full"
              type="button"
              onClick={google}
              disabled={!googleAuthEnabled}
            >
              {googleAuthEnabled
                ? "Continue with Google"
                : "Google sign-in coming soon"}
            </button>
            <button
              className="btn quiet full"
              type="button"
              onClick={facebook}
              disabled={!facebookAuthEnabled}
            >
              {facebookAuthEnabled
                ? "Continue with Facebook"
                : "Facebook sign-in coming soon"}
            </button>
            <hr />
'''
login_index = text.find("function Login()")
head, tail = text[:login_index], text[login_index:]
if login_google_button in tail:
    tail = tail.replace(login_google_button, login_buttons, 1)
elif tail.count("Facebook sign-in coming soon") < 1:
    raise SystemExit("Login social button anchor not found")
text = head + tail

path.write_text(text)
