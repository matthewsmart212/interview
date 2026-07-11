"use client";

import { useState } from "react";
import Link from "next/link";
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
  resetToEmpty,
} from "../../lib/db";
import { useAppDb } from "../../lib/db/use-app-db";
import s from "./profile.module.css";

const ACCOUNT = [
  { Icon: FileText, label: "My CV", href: "/cv" },
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
  const { user, USER } = useAppDb();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const displayName = user?.name || USER.name || "Alex";

  const startEdit = () => {
    setNameDraft(displayName);
    setEditing(true);
  };

  const saveEdit = () => {
    const next = nameDraft.trim();
    if (next) updateUser({ name: next });
    setEditing(false);
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
            {displayName.toLowerCase().replace(/\s+/g, ".")}@email.com
          </div>
          <span className={`badge badge-brand ${s.role}`}>
            Customer Service Advisor
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
            onClick={() => resetToEmpty()}
          >
            <span className={s.mi}>
              <Shield size={19} />
            </span>
            <span className={s.lbl}>Clear all data</span>
            <ChevronRight size={19} className={s.chev} />
          </button>
        </div>
      </PageSection>

      <button type="button" className={s.logout}>
        <LogOut size={18} /> Log out
      </button>
    </AppShell>
  );
}
