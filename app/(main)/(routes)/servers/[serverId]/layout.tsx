// app/(main)/(routes)/servers/[serverId]/layout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerSidebar } from "@/components/server/server-sidebar";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}


export default async function ServerIdLayout(props: ServerIdLayoutProps) {
  const profile = await currentProfile();

  // Redirect if not logged in
  if (!profile) return redirect("/");

  const { serverId } = await props.params;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="hidden md:!flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:!pl-60">{props.children}</main>
    </div>
  );
}
