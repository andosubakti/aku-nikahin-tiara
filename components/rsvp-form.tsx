"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "RSVP Received!",
      description: "Thank you for your response. We look forward to celebrating with you!",
    })

    setIsSubmitting(false)
    e.currentTarget.reset()
  }

  return (
    <Card className="ghibli-card border-none">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label>Will you be attending?</Label>
            <RadioGroup defaultValue="yes">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="attending-yes" />
                <Label htmlFor="attending-yes" className="cursor-pointer">
                  Joyfully Accept
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="attending-no" />
                <Label htmlFor="attending-no" className="cursor-pointer">
                  Regretfully Decline
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests (including yourself)</Label>
            <Input id="guests" type="number" min="1" max="5" defaultValue="1" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Restrictions</Label>
            <Textarea id="dietary" placeholder="Please list any dietary restrictions or allergies" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to the Couple</Label>
            <Textarea id="message" placeholder="Share your well wishes or a favorite Ghibli quote" />
          </div>

          <Button type="submit" className="w-full bg-ghibli-green hover:bg-ghibli-green/90" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send RSVP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

