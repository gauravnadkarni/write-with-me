import * as React from 'react'
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  render,
} from '@react-email/components'

interface EmailProps {
  email: string
}

export const WelcomeEmail: React.FC<EmailProps> = (props) => {
  const { email } = props

  return (
    <Html>
      <Head />
      <Preview>Welcome to Our Platform!</Preview>
      <Body
        style={{ backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Heading style={{ textAlign: 'center', color: '#4CAF50' }}>
            Welcome to Our Platform!
          </Heading>
          <Text>Hello {email},</Text>
          <Text>
            Thank you for signing up with us. We&apos;re excited to have you
            onboard!
          </Text>
          <Text>Best regards,</Text>
          <Text>The Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const getComponentAsString = async (props: EmailProps) =>
  render(<WelcomeEmail {...props} />)

export default WelcomeEmail
