"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function BookRsvp() {
  const [status, setStatus] = useState("");
  return <section id="rsvp" className="section-container book-rsvp">
    <div className="section-heading"><p className="eyebrow">A seat beside our story</p><h2>Will you <em>join us?</em></h2><p>We would love to celebrate with you.</p></div>
    <form className="wish-form" onSubmit={event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      try {
        localStorage.setItem("wedding_rsvp_draft", JSON.stringify(data));
        setStatus("Your response is saved on this device. Please share your attendance with the family directly to confirm your RSVP.");
      } catch { setStatus("Your response could not be saved. Please contact the family directly to confirm your attendance."); }
    }}>
      <Heart size={24} strokeWidth={1} />
      <label htmlFor="rsvp-name">Your name</label><input id="rsvp-name" name="name" autoComplete="name" required maxLength={100} />
      <label htmlFor="rsvp-attendance">Will you attend?</label><select id="rsvp-attendance" name="attending"><option value="yes">Joyfully accept</option><option value="no">Regretfully decline</option></select>
      <label htmlFor="rsvp-guests">Number of guests, including you</label><input id="rsvp-guests" name="guests" type="number" min="1" max="20" defaultValue="1" required />
      <p className="storage-note">This saves a personal note on your device only. Contact the family directly to confirm your attendance.</p>
      <button type="submit" className="button button-primary">Save my response</button><p role="status" className="form-status">{status}</p>
    </form>
  </section>;
}
