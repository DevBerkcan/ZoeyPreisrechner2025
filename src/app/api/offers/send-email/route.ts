import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  // Check for API key at runtime
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "E-Mail-Service nicht konfiguriert. Bitte RESEND_API_KEY setzen." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const customerName = formData.get("customerName") as string;
    const pdfBlob = formData.get("pdf") as Blob;

    if (!email || !customerName || !pdfBlob) {
      return NextResponse.json(
        { error: "E-Mail, Kundenname und PDF sind erforderlich" },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const { data, error } = await resend.emails.send({
      from: "NAZAR Beauty <angebote@nazar-beauty.de>",
      to: email,
      subject: `Ihr Kostenvoranschlag - NAZAR Beauty`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Ihr persoenliches Angebot</h2>
          <p>Liebe/r ${customerName},</p>
          <p>vielen Dank fuer Ihr Interesse an unseren Behandlungen!</p>
          <p>Im Anhang finden Sie Ihren individuellen Kostenvoranschlag.</p>
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfuegung.</p>
          <br>
          <p>Mit freundlichen Gruessen,<br>Ihr NAZAR Beauty Team</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">
            NAZAR Beauty & Wellness<br>
            E-Mail: info@nazar-beauty.de
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Angebot_${customerName.replace(/\s+/g, "_")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Fehler beim Senden der E-Mail" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Fehler beim Senden der E-Mail" },
      { status: 500 }
    );
  }
}
