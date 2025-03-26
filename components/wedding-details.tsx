import { CalendarDays, Clock, MapPin, Music, Utensils } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function WeddingDetails() {
  return (
    <section id="details" className="my-20 scroll-mt-16">
      <h2 className="mb-8 text-center font-serif text-3xl font-medium text-emerald-800 md:text-4xl">Our Special Day</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="ghibli-card border-none">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <CalendarDays className="h-6 w-6 text-emerald-700" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium text-emerald-800">Date</h3>
            <p className="text-emerald-600">August 15, 2025</p>
          </CardContent>
        </Card>

        <Card className="ghibli-card border-none">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <Clock className="h-6 w-6 text-emerald-700" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium text-emerald-800">Time</h3>
            <p className="text-emerald-600">Ceremony: 2:00 PM</p>
            <p className="text-emerald-600">Reception: 4:00 PM</p>
          </CardContent>
        </Card>

        <Card className="ghibli-card border-none">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <MapPin className="h-6 w-6 text-emerald-700" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium text-emerald-800">Location</h3>
            <p className="text-emerald-600">Enchanted Garden</p>
            <p className="text-emerald-600">123 Sakura Lane, Kyoto, Japan</p>
          </CardContent>
        </Card>

        <Card className="ghibli-card border-none">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <Utensils className="h-6 w-6 text-emerald-700" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium text-emerald-800">Menu</h3>
            <p className="text-emerald-600">Traditional Japanese Cuisine</p>
            <p className="text-emerald-600">Vegetarian Options Available</p>
          </CardContent>
        </Card>

        <Card className="ghibli-card border-none md:col-span-2 lg:col-span-2">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-emerald-100 p-3">
              <Music className="h-6 w-6 text-emerald-700" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium text-emerald-800">Dress Code</h3>
            <p className="text-emerald-600">Semi-formal attire with a touch of Ghibli magic</p>
            <p className="mt-2 text-sm italic text-emerald-500">
              Feel free to incorporate subtle elements inspired by your favorite Ghibli films
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

