

"use client"

import * as React from "react"
import { AriaColorSliderOptions, useColorSlider } from "@react-aria/color"
import { useFocusRing } from "@react-aria/focus"
import { useLocale } from "@react-aria/i18n"
import { VisuallyHidden } from "@react-aria/visually-hidden"

import {
  ColorSliderStateOptions,
  useColorSliderState,
} from "@react-stately/color"

const TRACK_THICKNESS = 16
const THUMB_SIZE = 20

export interface ColorSlider {}

export function ColorSlider(
  props: ColorSliderStateOptions | AriaColorSliderOptions
) {
  let { locale } = useLocale()
  let state = useColorSliderState({ ...props, locale })
  let trackRef = React.useRef(null)
  let inputRef = React.useRef(null)

  // Default label to the channel name in the current locale
  let label = props.label || state.value.getChannelName(props.channel, locale)

  let { trackProps, thumbProps, inputProps, labelProps, outputProps } =
    useColorSlider(
      {
        ...props,
        label,
        trackRef,
        inputRef,
      },
      state
    )

  let { focusProps, isFocusVisible } = useFocusRing()
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 248,
          gap: 8,
        }}
      >
    <div style={{ display: 'flex', alignSelf: 'stretch' }}>
        <label className="hidden" {...labelProps}>{label}</label>
        <output className="hidden" {...outputProps} style={{ flex: '1 0 auto', textAlign: 'end' }}>
          {state.value.formatChannelValue(props.channel, locale)}
        </output>
      </div>
      <div
        className="color-slider-track"
        {...trackProps}
        ref={trackRef}
        style={{
                     ...trackProps.style,
            height: TRACK_THICKNESS,
            width: "100%",
            borderRadius: 16,
        }}
      >
        <div className="color-slider-track-background"></div>
        <div
          className="color-slider-track-color"
          style={{
            ...trackProps.style
          }}
        >
        </div>
        <div
          className={`color-slider-thumb${isFocusVisible ? ' is-focused' : ''}`}
          {...thumbProps}
          style={{
                       ...thumbProps.style,
              top: TRACK_THICKNESS / 2,
              border: "2px solid white",
              boxShadow:
                "0 0 0 1px rgba(142, 142, 142, 0.3), inset 0 0 0 1px rgba(142, 142, 142, 0.3)",
              width: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
              height: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
              borderRadius: "50%",
              boxSizing: "border-box",
              background: state.getDisplayColor().toString("css"),
          }}
        >
          <div className="color-slider-thumb-background"></div>
          <div
            className="color-slider-thumb-color"
            style={{
              background: state.getDisplayColor().toString('css')
            }}
          >
          </div>
          <VisuallyHidden>
            <input ref={inputRef} {...inputProps} {...focusProps} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
    </div>
  );
}
