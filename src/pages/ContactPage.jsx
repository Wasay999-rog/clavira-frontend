import { useState } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './ContactPage.css';

export default function ContactPage({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.topic) e.topic = 'Select a topic';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    try {
      await api.submitContact(form);
      setSubmitted(true);
      showToast('✅ Message sent successfully!');
    } catch (err) {
      if (err.detail && typeof err.detail === 'object') setErrors(err.detail);
      else showToast('❌ Could not send. Try again.');
    } finally { setSubmitting(false); }
  };

  const inp = f => `contact-input ${errors[f] ? 'err' : ''}`;

  return (
    <div className="contact-page"><Section>
      <h1 className="pg-heading">Get in Touch</h1>
      <p className="pg-sub">We'd love to hear from you</p>
      <div className="contact-grid">
        <div className="contact-methods">
          {[
            { icon: '📧', label: 'General Inquiries', value: 'hello@clavirafinance.com' },
            { icon: '💰', label: 'Investors', value: 'investors@clavirafinance.com' },
            { icon: '🤝', label: 'Partnerships', value: 'partners@clavirafinance.com' },
            { icon: '🛟', label: 'Support', value: 'support@clavirafinance.com' },
            { icon: '📍', label: 'Location', value: 'San Francisco, CA' },
          ].map(c => (
            <div key={c.label} className="contact-item">
              <span className="contact-icon">{c.icon}</span>
              <div><div className="contact-label">{c.label}</div><div className="contact-value">{c.value}</div></div>
            </div>
          ))}
        </div>
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-ok">
              <div className="contact-ok-icon">✅</div>
              <div className="contact-ok-title">Message Sent!</div>
              <div className="contact-ok-sub">We'll get back to you within 24 hours.</div>
            </div>
          ) : (
            <div className="contact-form">
              <div className="fg"><label>Name</label><input className={inp('name')} value={form.name} onChange={e => set('name',e.target.value)} placeholder="Your name" />{errors.name && <div className="fe">{errors.name}</div>}</div>
              <div className="fg"><label>Email</label><input className={inp('email')} value={form.email} onChange={e => set('email',e.target.value)} placeholder="you@example.com" />{errors.email && <div className="fe">{errors.email}</div>}</div>
              <div className="fg"><label>Topic</label>
                <select className={inp('topic')} value={form.topic} onChange={e => set('topic',e.target.value)}>
                  <option value="">Select a topic</option><option value="general">General</option><option value="support">Support</option><option value="billing">Billing</option><option value="partnership">Partnership</option><option value="press">Press</option>
                </select>{errors.topic && <div className="fe">{errors.topic}</div>}
              </div>
              <div className="fg"><label>Message</label><textarea className={inp('message')} value={form.message} onChange={e => set('message',e.target.value)} rows={5} placeholder="How can we help?" />{errors.message && <div className="fe">{errors.message}</div>}</div>
              <button className="contact-submit" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>
            </div>
          )}
        </div>
      </div>
    </Section></div>
  );
}
