'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GrowingTree from './growing-tree'

interface ProofModalProps {
  taskTitle: string
  taskId: string
  durationMinutes: number
  onValidated: () => void
  onFailed: () => void
  onClose: () => void
}

type Status = 'idle' | 'validating' | 'valid' | 'invalid'

export default function ProofModal({
  taskTitle,
  taskId,
  durationMinutes,
  onValidated,
  onFailed,
  onClose,
}: ProofModalProps) {
  const [proof, setProof] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setUploadedPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setUploadedPreview(null)
    }
  }

  function removeFile() {
    setUploadedFile(null)
    setUploadedPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    if (!proof.trim() && !uploadedFile) return
    setStatus('validating')

    try {
      const response = await fetch('/api/validate-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle,
          proof: proof.trim() || (uploadedFile ? `User uploaded a file: ${uploadedFile.name}` : ''),
          durationMinutes,
          hasFile: !!uploadedFile,
        })
      })

      const data = await response.json()

      if (data.valid) {
        setStatus('valid')
        setFeedback(data.feedback)
        setTimeout(() => onValidated(), 2500)
      } else {
        setStatus('invalid')
        setFeedback(data.feedback)
        setTimeout(() => onFailed(), 2500)
      }
    } catch (e) {
      const isSubstantial = proof.trim().split(' ').length >= 5 || !!uploadedFile
      setStatus(isSubstantial ? 'valid' : 'invalid')
      setFeedback(
        isSubstantial
          ? 'Great work! Your tree has been added to your forest.'
          : 'Please describe what you accomplished or upload proof.'
      )
      setTimeout(() => {
        isSubstantial ? onValidated() : onFailed()
      }, 2500)
    }
  }

  const canSubmit = proof.trim().length > 0 || !!uploadedFile

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={status === 'idle' ? onClose : undefined}
      >
        <motion.div
          className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{ background: '#fff', maxHeight: '90vh', overflowY: 'auto' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
          </div>

          {/* IDLE STATE */}
          {status === 'idle' && (
            <div className="p-5 space-y-4">

              {/* Header */}
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <GrowingTree progress={1} size={70} durationMinutes={durationMinutes} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Prove your work
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your tree is ready. Show us what you accomplished.
                </p>
              </div>

              {/* Task completed badge */}
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}
              >
                <span className="text-lg">✅</span>
                <div>
                  <p className="text-xs font-semibold text-green-700">Task completed</p>
                  <p className="text-sm text-slate-700 font-medium">{taskTitle}</p>
                  <p className="text-xs text-slate-400">{durationMinutes} minute session</p>
                </div>
              </div>

              {/* Proof text input */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  What did you accomplish?
                </p>
                <textarea
                  autoFocus
                  value={proof}
                  onChange={e => setProof(e.target.value)}
                  placeholder="Describe what you did. Be specific. e.g. 'Finished reading chapter 3 and wrote notes on 5 key concepts'"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    fontFamily: 'inherit',
                    color: '#374151',
                    lineHeight: '1.6',
                  }}
                  onFocus={e => e.target.style.borderColor = '#16A34A'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>

              {/* Upload section */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Upload proof (optional)
                </p>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {!uploadedFile ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-all"
                    style={{
                      borderColor: '#CBD5E1',
                      background: '#F8FAFC',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#16A34A'
                      e.currentTarget.style.background = '#F0FDF4'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#CBD5E1'
                      e.currentTarget.style.background = '#F8FAFC'
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
                    >
                      +
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        Upload photo or file
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Photo, PDF, or document
                      </p>
                    </div>
                  </button>
                ) : (
                  <div
                    className="rounded-2xl p-3 flex items-center gap-3"
                    style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}
                  >
                    {uploadedPreview ? (
                      <img
                        src={uploadedPreview}
                        alt="proof"
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: '#DCFCE7' }}
                      >
                        📄
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(uploadedFile.size / 1024).toFixed(0)} KB
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        ✓ Ready to submit
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: '#FEF2F2', color: '#EF4444' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 text-center">
                AI will review your proof before adding the tree to your forest.
              </p>

              {/* Submit buttons */}
              <div className="space-y-2 pb-2">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: canSubmit
                      ? 'linear-gradient(135deg, #16A34A, #15803D)'
                      : '#E2E8F0',
                    color: canSubmit ? '#fff' : '#94A3B8',
                  }}
                >
                  Submit proof 🌳
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  I did not finish this task
                </button>
              </div>

            </div>
          )}

          {/* VALIDATING STATE */}
          {status === 'validating' && (
            <div className="p-8 text-center space-y-5">
              <motion.div
                className="flex justify-center"
                animate={{ rotate: [0, 5, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <GrowingTree progress={0.8} size={100} durationMinutes={durationMinutes} />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  AI is reviewing your proof...
                </h2>
                <p className="text-sm text-slate-400">
                  Checking if your work matches the task.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: '#16A34A' }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VALID STATE */}
          {status === 'valid' && (
            <div className="p-8 text-center space-y-4">
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, ease: 'backOut' }}
              >
                <GrowingTree progress={1} size={120} durationMinutes={durationMinutes} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: '#F0FDF4', color: '#16A34A' }}
                >
                  Proof validated ✓
                </div>
                <h2
                  className="text-xl font-black tracking-tight mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #16A34A, #15803D)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  TREE ADDED TO YOUR FOREST!
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">{feedback}</p>
              </motion.div>

              {/* Confetti */}
              <div className="relative h-8 overflow-hidden">
                {['#16A34A', '#22C55E', '#F472B6', '#FBBF24', '#60A5FA', '#A78BFA'].map((color, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: color, left: `${10 + i * 15}%`, top: 0 }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 40, opacity: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.8 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* INVALID STATE */}
          {status === 'invalid' && (
            <div className="p-8 text-center space-y-4">
              <motion.div
                className="flex justify-center"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <GrowingTree progress={0} isDead={true} size={100} durationMinutes={durationMinutes} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: '#FEF2F2', color: '#EF4444' }}
                >
                  Proof not accepted
                </div>
                <h2
                  className="text-xl font-black tracking-tight mb-2"
                  style={{ color: '#EF4444' }}
                >
                  TREE DIED
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">{feedback}</p>
              </motion.div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}