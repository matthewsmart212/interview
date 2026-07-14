"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import { AppShell, PageSection } from "../../components/ui";
import Avatar from "../../components/Avatar";
import {
  Settings,
  Edit,
  Sparkle,
  FileText,
  Bookmark,
  Bell,
  Volume,
  CreditCard,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
} from "../../components/Icons";
import {
  updateUser,
  resetToDemo,
  resetToFreshOnboarding,
} from "../../lib/db";
import { useAppDb } from "../../lib/db/use-app-db";
import {
  getSessionUser,
  pushLocalToSupabase,
  pullSupabaseToLocal,
  signOut,
} from "../../lib/supabase/sync";
import s from "./profile.module.css";

const ACCOUNT = [
  { Icon: FileText, label: "Replace CV", href: "/cv/upload" },
  { Icon: Bookmark, label: "Saved Questions", href: "/questions" },
  { Icon: CreditCard, label: "Subscription", href: "/profile" },
];
const PREFS = [
  { Icon: Bell, label: "Notifications", href: "/profile" },
  { Icon: Volume, label: "Voice & Language", href: "/profile" },
  { Icon: Settings, label: "Settings", href: "/profile" },
];
const SUPPORT = [
  { Icon: HelpCircle, label: "Help & Support", href: "/profile" },
  { Icon: Shield, label: "Privacy & Security", href: "/profile" },
];

function Menu({ items }) {
  return (
    <div className={`card ${s.menu}`}>
      {items.map(({ Icon, label, href }) => (
        <Link className={s.item} key={label} href={href}>
          <span className={s.mi}>
            <Icon size={19} />
          </span>
          <span className={s.lbl}>{label}</span>
          <ChevronRight size={19} className={s.chev} />
        </Link>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, USER, MASTER_CV } = useAppDb();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [syncMsg, setSyncMsg] = useState("");

  const displayName = user?.name || USER.name || "Alex";

  useEffect(() => {
    getSessionUser().then((u) => {
      if (u?.email) setAuthEmail(u.email);
    });
  }, []);

  const startEdit = () => {
    setNameDraft(displayName);
    setEditing(true);
  };

  const saveEdit = () => {
    const next = nameDraft.trim();
    if (next) updateUser({ name: next });
    setEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleRestartFresh = () => {
    resetToFreshOnboarding();
    router.replace("/");
  };

  const handleSync = async () => {
    setSyncMsg("Syncing…");
    const pull = await pullSupabaseToLocal();
    if (!pull.ok && pull.error !== "Not signed in") {
      setSyncMsg(pull.error || "Pull failed");
      return;
    }
    const push = await pushLocalToSupabase();
    setSyncMsg(push.ok ? "Synced with cloud." : push.error || "Sync failed");
  };

  return (
    <AppShell>
      <PageHeader
        icon="user"
        title="Profile"
        description="Account, preferences and subscription"
      />

      <div className={`card ${s.header}`}>
        <Avatar pose="idle" round alt="Your profile photo" className={s.pic} />
        <div className="grow">
          {editing ? (
            <input
              className="input"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              aria-label="Your name"
            />
          ) : (
            <div className={s.name}>{displayName}</div>
          )}
          <div className={s.email}>
            {authEmail ||
              `${displayName.toLowerCase().replace(/\s+/g, ".")}@email.com`}
          </div>
          <span className={`badge badge-brand ${s.role}`}>
            {authEmail ? "Signed in" : "Local only"}
          </span>
        </div>
        {editing ? (
          <button type="button" className={s.editBtn} onClick={saveEdit}>
            Save
          </button>
        ) : (
          <button type="button" className={s.editBtn} onClick={startEdit}>
            <Edit size={15} /> Edit
          </button>
        )}
      </div>

      <div className={s.pro}>
        <Sparkle size={24} />
        <div className={s.pt}>
          <b>Upgrade to Pro</b>
          <span>Unlimited mock interviews & CV reviews</span>
        </div>
        <button type="button" className={s.go}>
          Upgrade
        </button>
      </div>

      <PageSection title="Your CV">
        <div className={`card ${s.menu}`}>
          <Link className={s.item} href="/cv/upload">
            <span className={s.mi}>
              <FileText size={19} />
            </span>
            <span className={s.lbl}>
              {MASTER_CV.exists
                ? `Replace CV (${MASTER_CV.fileName})`
                : "Upload your CV"}
            </span>
            <ChevronRight size={19} className={s.chev} />
          </Link>
        </div>
        <p className="page-sub" style={{ marginTop: 8 }}>
          One CV powers every mock. Interviews carry the job description.
        </p>
      </PageSection>

      <PageSection title="Account">
        <Menu items={ACCOUNT} />
      </PageSection>

      <PageSection title="Preferences">
        <Menu items={PREFS} />
      </PageSection>

      <PageSection title="Support">
        <Menu items={SUPPORT} />
      </PageSection>

      <PageSection title="Data">
        <div className={`card ${s.menu}`}>
          {authEmail ? (
            <button type="button" className={s.item} onClick={handleSync}>
              <span className={s.mi}>
                <Sparkle size={19} />
              </span>
              <span className={s.lbl}>Sync with cloud</span>
              <ChevronRight size={19} className={s.chev} />
            </button>
          ) : (
            <Link className={s.item} href="/login">
              <span className={s.mi}>
                <Sparkle size={19} />
              </span>
              <span className={s.lbl}>Sign in to sync</span>
              <ChevronRight size={19} className={s.chev} />
            </Link>
          )}
          <button
            type="button"
            className={s.item}
            onClick={() => resetToDemo()}
          >
            <span className={s.mi}>
              <Sparkle size={19} />
            </span>
            <span className={s.lbl}>Reset to demo data</span>
            <ChevronRight size={19} className={s.chev} />
          </button>
          <button
            type="button"
            className={s.item}
            onClick={handleRestartFresh}
          >
            <span className={s.mi}>
              <Shield size={19} />
            </span>
            <span className={s.lbl}>Clear &amp; restart onboarding</span>
            <ChevronRight size={19} className={s.chev} />
          </button>
        </div>
        {syncMsg ? (
          <p className="page-sub" style={{ marginTop: 8, textAlign: "center" }}>
            {syncMsg}
          </p>
        ) : null}
      </PageSection>

      <button type="button" className={s.logout} onClick={handleLogout}>
        <LogOut size={18} /> Log out
      </button>
    </AppShell>
  );
}
