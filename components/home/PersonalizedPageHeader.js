"use client";

import { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import { useAppDb } from "../../lib/db/use-app-db";

export default function PersonalizedPageHeader({
  icon = "home",
  titlePrefix = "Hi",
  titleSuffix = " 👋",
  description,
  descriptionFallback,
  ...props
}) {
  const { USER } = useAppDb();
  const [name, setName] = useState(USER.name);

  useEffect(() => {
    setName(USER.name);
    const profile = loadProfile();
    if (profile?.name?.trim()) {
      setName(getFirstName(profile));
    }
  }, [USER.name]);

  const resolvedDescription =
    description ??
    descriptionFallback ??
    "What would you like to prepare for?";

  return (
    <PageHeader
      icon={icon}
      title={`${titlePrefix} ${name}${titleSuffix}`}
      description={resolvedDescription}
      {...props}
    />
  );
}
