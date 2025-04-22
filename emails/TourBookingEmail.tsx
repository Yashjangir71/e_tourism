import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Tailwind,
  } from '@react-email/components';
  
  interface ItineraryItem {
    place: string;
    plan: string;
    time: string;
  }
  
  interface TourBookingEmailProps {
    username: string;
    tourName: string;
    vendorName: string;
    vendorPhone: string;
    description: string;
    itinerary: ItineraryItem[];
  }
  
  export default function TourBookingEmail({
    username,
    tourName,
    vendorName,
    vendorPhone,
    description,
    itinerary,
  }: TourBookingEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Tour Booking Confirmation</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Your tour "{tourName}" has been successfully booked!</Preview>
        <Tailwind>
          <Section className="p-4 bg-white">
            <Row>
              <Heading as="h2" className="text-2xl font-semibold">
                Hi {username},
              </Heading>
            </Row>
            <Row>
              <Text className="text-base">
                We're excited to let you know that your tour{' '}
                <span className="font-semibold">"{tourName}"</span> has been successfully
                booked!
              </Text>
            </Row>
  
            <Row>
              <Heading as="h3" className="text-xl font-medium mt-4 mb-2">
                Tour Details:
              </Heading>
            </Row>
  
            <Row>
              <Text><strong>Tour Name:</strong> {tourName}</Text>
              <Text><strong>Organized by:</strong> {vendorName}</Text>
              <Text><strong>Vendor Phone:</strong> {vendorPhone}</Text>
              <Text className="mt-2"><strong>Description:</strong></Text>
              <Text>{description}</Text>
            </Row>
  
            <Row>
              <Heading as="h3" className="text-lg font-medium mt-4 mb-2">
                Itinerary:
              </Heading>
              {itinerary.map((item, index) => (
                <Section key={index} className="mb-2 pl-4 border-l-2 border-gray-300">
                  <Text className="font-semibold">{item.time}</Text>
                  <Text><strong>Place:</strong> {item.place}</Text>
                  <Text><strong>Plan:</strong> {item.plan}</Text>
                </Section>
              ))}
            </Row>
  
            <Row className="mt-4">
              <Text>
                If you have any questions, feel free to reach out to the vendor directly.
                We hope you have a wonderful experience!
              </Text>
            </Row>
  
            <Row className="mt-6">
              <Text>Thank you for choosing our platform ✨</Text>
              <Text className="text-sm text-gray-500">– The Travel Team</Text>
            </Row>
          </Section>
        </Tailwind>
      </Html>
    );
  }
  