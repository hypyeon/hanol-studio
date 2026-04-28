import { CalendarCheck, CalendarX, MessageCircleQuestionMark } from 'lucide-react';

export const businessHours = [
  { day: "Mon", time: "Closed", closed: true },
  { day: "Tue - Fri", time: "10:30 a.m. – 4:30 p.m. & 7:30 p.m. – 9:30 p.m." },
  { day: "Sat", time: "10:30 a.m. – 4:30 p.m." },
  { day: "Sun", time: "10:30 a.m. – 1:30 p.m." },
];

export const contactSections = [
  {
    icon: CalendarCheck,
    title: "To book an appointment",
    content: "All appointments are accepted through",
    link: "/booking",
    linkText: "booking",
    content2: " page."
  },
  {
    icon: CalendarX,
    title: "To reschedule or cancel",
    content: "Rescheduling & cancellation can be done through the appointment link sent via email. Please note our 48-hour cancellation policy."
  },
  {
    icon: MessageCircleQuestionMark,
    title: "Other inquiries",
    content: "We try our best to get back to you as soon as possible but please allow up to 3 hours to hear back in case the artist is in a session. "
  }
]