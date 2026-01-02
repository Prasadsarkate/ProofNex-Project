"use client"

import React, { useState } from "react"

type Props = {
  className?: string
}

export default function Logo({ className }: Props) {
  const [src, setSrc] = useState('/images/proofnex-logo.jpg')
  const onError = () => setSrc('/images/placeholder-logo.png')
  return <img src={src} alt="ProofNex logo" className={className} onError={onError} />
}
