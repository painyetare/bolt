"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguageStore } from "@/store/languageStore"
import { translations } from "@/lib/translations"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  businessType: z.string({
    required_error: "Please select a business type.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  categories: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
})

const categories = [
  { id: "clothing", label: "Clothing" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home & Garden" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "sports", label: "Sports & Outdoors" },
  { id: "toys", label: "Toys & Games" },
  { id: "automotive", label: "Automotive" },
  { id: "books", label: "Books & Media" },
  { id: "food", label: "Food & Beverages" },
  { id: "health", label: "Health & Wellness" },
]

export function BecomeSellerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { language } = useLanguageStore()

  // Get translations based on selected language with fallbacks
  const getTranslation = (key, defaultValue) => {
    try {
      if (language === "zh" && translations.zh?.common?.[key]) {
        return translations.zh.common[key]
      } else if (language === "ro" && translations.ro?.common?.[key]) {
        return translations.ro.common[key]
      } else if (language === "de" && translations.de?.common?.[key]) {
        return translations.de.common[key]
      } else if (language === "fr" && translations.fr?.common?.[key]) {
        return translations.fr.common[key]
      } else if (language === "ru" && translations.ru?.common?.[key]) {
        return translations.ru.common[key]
      } else if (translations.en?.common?.[key]) {
        return translations.en.common[key]
      }
      return defaultValue
    } catch (error) {
      return defaultValue
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      description: "",
      categories: [],
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Save to Supabase
      const { error } = await supabase.from("seller_applications").insert([
        {
          business_name: values.businessName,
          email: values.email,
          phone: values.phone,
          website: values.website || null,
          business_type: values.businessType,
          description: values.description,
          categories: values.categories,
          status: "pending",
        },
      ])

      if (error) {
        console.error("Error submitting application:", error)
        throw error
      }

      // Redirect to success page
      router.push("/sellers/application-submitted")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-black border-red-900/30">
      <CardHeader>
        <CardTitle className="text-2xl text-white">{getTranslation("becomeSeller", "Become a Seller")}</CardTitle>
        <CardDescription>
          {getTranslation("becomeSellerDesc", "Fill out the form below to apply to become a seller on our platform.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("businessName", "Business Name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Your business name" {...field} className="bg-black/50 border-red-900/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("emailAddress", "Email Address")}</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} className="bg-black/50 border-red-900/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("phoneNumber", "Phone Number")}</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} className="bg-black/50 border-red-900/30" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {getTranslation("website", "Website")} ({getTranslation("optional", "Optional")})
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-website.com"
                        {...field}
                        className="bg-black/50 border-red-900/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("businessType", "Business Type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-red-900/30">
                          <SelectValue placeholder={getTranslation("selectBusinessType", "Select business type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-red-900/30">
                        <SelectItem value="manufacturer">{getTranslation("manufacturer", "Manufacturer")}</SelectItem>
                        <SelectItem value="wholesaler">{getTranslation("wholesaler", "Wholesaler")}</SelectItem>
                        <SelectItem value="retailer">{getTranslation("retailer", "Retailer")}</SelectItem>
                        <SelectItem value="dropshipper">{getTranslation("dropshipper", "Dropshipper")}</SelectItem>
                        <SelectItem value="other">{getTranslation("other", "Other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>{getTranslation("productCategories", "Product Categories")}</FormLabel>
                      <FormDescription>
                        {getTranslation("selectCategories", "Select the categories that best describe your products.")}
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category.id])
                                        : field.onChange(field.value?.filter((value) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {getTranslation(category.id.toLowerCase(), category.label)}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation("businessDescription", "Business Description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={getTranslation("tellUsAbout", "Tell us about your business and products...")}
                      className="min-h-[120px] bg-black/50 border-red-900/30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {getTranslation(
                      "descriptionHelp",
                      "Provide details about your business, products, and what makes you unique.",
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">
                      {getTranslation("agreeToTerms", "I agree to the")}{" "}
                      <a href="/terms" className="text-red-400 hover:text-red-300 underline">
                        {getTranslation("termsOfService", "Terms of Service")}
                      </a>{" "}
                      {getTranslation("and", "and")}{" "}
                      <a href="/privacy" className="text-red-400 hover:text-red-300 underline">
                        {getTranslation("privacyPolicy", "Privacy Policy")}
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-red-900 hover:bg-red-800" disabled={isSubmitting}>
              {isSubmitting ? (
                <>{getTranslation("submitting", "Submitting...")}</>
              ) : (
                <>{getTranslation("submitApplication", "Submit Application")}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-red-900/20 pt-6">
        <div className="text-sm text-gray-400">
          <p className="mb-2">{getTranslation("applicationProcess", "Application Process")}:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>{getTranslation("applicationStep1", "Submit your application")}</li>
            <li>{getTranslation("applicationStep2", "Our team will review your application (1-3 business days)")}</li>
            <li>{getTranslation("applicationStep3", "If approved, you'll receive an email with next steps")}</li>
            <li>{getTranslation("applicationStep4", "Complete seller onboarding and start selling")}</li>
          </ol>
        </div>
      </CardFooter>
    </Card>
  )
}
