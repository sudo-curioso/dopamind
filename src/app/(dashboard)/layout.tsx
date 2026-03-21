import Navbar from '@/components/layouts/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="pt-14">
      {children}
      <Navbar />
    </div>
  )
}