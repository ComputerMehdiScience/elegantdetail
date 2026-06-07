"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do you come to my location?",
    answer:
      "Yes. That is the whole point. We are a fully mobile detailing service. You give us a parking spot and we handle everything else. No drop-off, no driving to a shop.",
  },
  {
    question: "How long does a detail take?",
    answer:
      "An interior detail takes roughly 1.5 to 2.5 hours. An exterior detail takes 45 minutes to 1.5 hours. A full detail is typically 2.5 to 4 hours. This varies by vehicle size and condition.",
  },
  {
    question: "Do I need to prepare my car before you arrive?",
    answer:
      "No preparation needed. Just make sure we have access to the vehicle. We bring all equipment, products, and supplies.",
  },
  {
    question: "Do you need access to water or electricity?",
    answer:
      "For most services we ask for access to a water source. If that is not available at your location, let us know when booking and we will make arrangements.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "You can book directly on this site in under 2 minutes. Choose your service, pick a date and time, and confirm. We will follow up within the hour.",
  },
  {
    question: "What if the weather is bad on my appointment day?",
    answer:
      "If weather prevents us from completing the service, we will reach out to reschedule at no extra charge. Interior-only services are generally unaffected by rain.",
  },
];

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header — no pill */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#111] sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-8 text-black/55">
            Everything you need to know before you book.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.35 }}
              >
                <Card className={`overflow-hidden border py-0 transition-all ${isOpen ? "border-[#c8ccd4]/60 shadow-[0_2px_16px_rgba(247,216,75,0.1)]" : "border-black/[0.08]"} rounded-2xl bg-white shadow-sm`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-3 text-left"
                  >
                    <span className="pr-4 text-base font-extrabold text-[#111] sm:text-lg">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="shrink-0"
                    >
                      <ChevronDown className={`h-5 w-5 transition-colors ${isOpen ? "text-[#5b6470]" : "text-black/35"}`} />
                    </motion.div>
                  </button>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-black/[0.06] px-5 py-3.5">
                        <p className="text-[0.98rem] leading-7 text-black/62">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center md:mt-14">
          <p className="text-base text-black/50">
            Still have a question?{" "}
            <a
              href="mailto:elegantautodetailing@gmail.com"
              className="font-semibold text-[#111] underline underline-offset-2 transition hover:text-[#5b6470]"
            >
              Send us a message
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
