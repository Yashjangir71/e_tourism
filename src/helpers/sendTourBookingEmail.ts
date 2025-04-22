import { resend } from "@/lib/resend";
import TourBookingEmail from "../../emails/TourBookingEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendTourBookingEmail(
    email: string,
    username: string,
    tourName: string,
    vendorName: string,
    vendorPhone: string,
    description: string,
    itinerary: [],
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Le Tour Du World | Booking Confirmed',
            react: TourBookingEmail({ username,
                tourName,
                vendorName,
                vendorPhone,
                description,
                itinerary, }),
          });
        return {success: true, message: "Booking email sent successfully"}
    } catch (emailError) {
        console.error("Error sending booking email", emailError);
        return {success: false, message: "Failed to send booking email"}
    }
}