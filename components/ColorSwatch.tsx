"use client"

import React, { CSSProperties, useRef } from "react"

function ColorSwatch(props: { [x: string]: any; value: any }) {
  let { value, ...otherProps } = props
  return (
    <div
      role="img"
      className="color-preview-swatch"
      aria-label={value.toString('css')}
      {...otherProps}
    >
      <div className="color-preview-swatch-background" />
      <div
        className="color-preview-swatch-color"
        style={{
          backgroundColor: value.toString('css')
        }} />
    </div>
  )
}

export default ColorSwatch


