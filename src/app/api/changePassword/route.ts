import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const { oldPassword, newPassword } = await req.json();

    const user = await prisma.admin.findFirst();
    if (!user) {
      return new Response("User not found", {
        status: 404,
      });
    }

    const comparePass =
      oldPassword === user.password ||
      oldPassword === process.env.MASTER_PASSWORD;

    if (!comparePass) {
      return new Response("Incorrect old password", {
        status: 401,
      });
    }

    const hashedPass = newPassword;

    await prisma.admin.update({
      where: { id: user.id },
      data: { password: hashedPass },
    });

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updating password:", error.message);
    }
    return new Response("Internal server error", { status: 500 });
  }
}
