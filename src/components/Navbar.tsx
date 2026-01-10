import Link from 'next/link'
import { JSX } from 'react'

export default function Navbar(): JSX.Element {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #eaeaea' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>College Project</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  )
}
