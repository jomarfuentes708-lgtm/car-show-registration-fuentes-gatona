import { useEffect, useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');

const fieldClass =
  'w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#5a5c69] shadow-sm transition focus:border-[#4e73df] focus:outline-none focus:ring-2 focus:ring-[#4e73df]/30';

const initialForm = {
  participantName: '',
  contactNumber: '',
  email: '',
  address: '',
  carMakeModel: '',
  plateNumber: '',
  registrationType: 'Exhibitor',
  amountPaid: '0',
};

function extractErrors(payload) {
  if (!payload || typeof payload !== 'object') return {};
  if (payload.errors && typeof payload.errors === 'object') {
    return Object.entries(payload.errors).reduce((acc, [key, value]) => {
      acc[key] = Array.isArray(value) ? value.join(' ') : String(value);
      return acc;
    }, {});
  }
  return {};
}

export default function NewRegistrationModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setFieldErrors({});
      setServerError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const formTitle = useMemo(() => 'New Registration', [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    const payload = {
      participantName: form.participantName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      carMakeModel: form.carMakeModel.trim(),
      plateNumber: form.plateNumber.trim(),
      registrationType: form.registrationType,
      amountPaid: Number(form.amountPaid || 0),
    };

    const requiredFields = [
      'participantName',
      'contactNumber',
      'email',
      'address',
      'carMakeModel',
      'plateNumber',
    ];

    const nextFieldErrors = {};
    requiredFields.forEach((field) => {
      if (!payload[field]) {
        nextFieldErrors[field] = 'This field is required.';
      }
    });

    if (Number.isNaN(payload.amountPaid)) {
      nextFieldErrors.amountPaid = 'Amount Paid must be a valid number.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        onCreated?.();
        onClose();
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      const errorJson = contentType.includes('application/json') ? await response.json() : null;

      if (response.status === 400) {
        const errors = extractErrors(errorJson);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return;
        }
        setServerError(errorJson?.detail || 'Please check the form and try again.');
        return;
      }

      if (response.status === 409) {
        setServerError(errorJson?.detail || 'A registration with this plate number already exists.');
        return;
      }

      setServerError('Could not create the registration. Please try again.');
    } catch (error) {
      setServerError('Cannot reach the API. Check that the backend is running and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 px-4 py-6"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-[0_15px_40px_rgba(17,24,39,0.2)]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#f8f9fc] px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-[#4e73df]">{formTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#5a5c69] transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]"
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Participant Name</label>
              <input name="participantName" value={form.participantName} onChange={handleChange} className={fieldClass} />
              {fieldErrors.participantName && <p className="mt-1 text-xs text-red-600">{fieldErrors.participantName}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Contact Number</label>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={fieldClass} />
              {fieldErrors.contactNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.contactNumber}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={fieldClass} />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Registration Type</label>
              <select name="registrationType" value={form.registrationType} onChange={handleChange} className={fieldClass}>
                <option value="Exhibitor">Exhibitor</option>
                <option value="Competitor">Competitor</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className={fieldClass} />
              {fieldErrors.address && <p className="mt-1 text-xs text-red-600">{fieldErrors.address}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Car Make / Model</label>
              <input name="carMakeModel" value={form.carMakeModel} onChange={handleChange} className={fieldClass} />
              {fieldErrors.carMakeModel && <p className="mt-1 text-xs text-red-600">{fieldErrors.carMakeModel}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Plate Number</label>
              <input name="plateNumber" value={form.plateNumber} onChange={handleChange} className={fieldClass} />
              {fieldErrors.plateNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.plateNumber}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#5a5c69]">Amount Paid</label>
              <input type="number" min="0" step="0.01" name="amountPaid" value={form.amountPaid} onChange={handleChange} className={fieldClass} />
              {fieldErrors.amountPaid && <p className="mt-1 text-xs text-red-600">{fieldErrors.amountPaid}</p>}
            </div>
          </div>

          {serverError && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#5a5c69] transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-[#4e73df] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2e59d9] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]"
            >
              {submitting ? 'Saving...' : 'Save Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
