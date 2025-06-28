
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodPageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodPage({
  params
}: InviteCodPageProps) {
  const profile = await currentProfile();
  const {redirectToSignIn} = await auth();
  const inviteCode = await params.inviteCode

  if (!profile) return redirectToSignIn();

  if (!inviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      member: {
        some: {
          profileId: profile?.id
        }
      }
    }
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode
    },
    data: {
      member: {
        create: [{ profileId: profile?.id! }]
      }
    }
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
}
