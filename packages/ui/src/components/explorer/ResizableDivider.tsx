import React from "react"
import styled from 'styled-components'

const VerticalDiv = styled.div`
      cursor: row-resize;
      background-color: #cbd5e0;
      width: 100%;
      height: 1px;

      &:hover {
        box-shadow: 0 0 0 3px rgba(220, 220, 220, 0.3);
      }
    `

const HorizontalDiv = styled.div`
      cursor: col-resize;
      background-color: #cbd5e0;
      width: 1px;
      height: 100%;

      &:hover {
        box-shadow: 0 0 0 3px rgba(220, 220, 220, 0.3);
      }
    `


/**
 * Resizable divider
 *
 * This is based on work from here, there is a major bug in the original version as it does not property handle
 * calculating percentages for BOTH of the siblings.
 *
 * TODO : Add touch event handling
 * TODO : Generalize to only have one set or variables
 *
 * @ref : https://htmldom.dev/create-resizable-split-views/
 * @param props
 * @constructor
 */

export default function ResizableDivider(props: {direction: "vertical" | "horizontal"}) {

    const {direction} = props
    const resizerRef = React.createRef<HTMLDivElement>()
    const cursor = direction === "horizontal" ? "col-resize" : "row-resize"

    // The current position of mouse
    let startX = 0
    let startY = 0

    let prevSiblingWidth = 0
    let prevSiblingHeight = 0

    let nextSiblingWidth = 0
    let nextSiblingHeight = 0

    const pxToPercent = (proportion: number, whole: number) => {
        if (whole < 1 || proportion < 0) return 0
        return Math.min((proportion / whole) * 100, 100)
    }

    const handleMouseDown = (event) => {
        const resizer = resizerRef.current

        if (resizer === null) {
            return
        }

        // Get the current mouse position
        startX = event.clientX
        startY = event.clientY

        const prevSibling = resizer.previousElementSibling as HTMLDivElement
        const nextSibling = resizer.nextElementSibling as HTMLDivElement

        prevSiblingWidth = prevSibling.getBoundingClientRect().width
        prevSiblingHeight = prevSibling.getBoundingClientRect().height

        nextSiblingWidth = nextSibling.getBoundingClientRect().width
        nextSiblingHeight = nextSibling.getBoundingClientRect().height

        // Attach the listeners to `document`
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseUp = (event) => {
        const resizer = resizerRef.current

        if (resizer === null) {
            return
        }

        const prevSibling = resizer.previousElementSibling as HTMLDivElement
        const nextSibling = resizer.nextElementSibling as HTMLDivElement

        // resizer.style.removeProperty('cursor');
        document.body.style.removeProperty("cursor")
        resizer.style.cursor = cursor

        prevSibling.style.removeProperty("user-select")
        prevSibling.style.removeProperty("pointer-events")

        nextSibling.style.removeProperty("user-select")
        nextSibling.style.removeProperty("pointer-events")

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event) => {
        const resizer = resizerRef.current
        if (resizer === null || resizer.parentNode == null) {
            return
        }

        const prevSibling = resizer.previousElementSibling as HTMLDivElement
        const nextSibling = resizer.nextElementSibling as HTMLDivElement

        if (!prevSibling || !nextSibling) {
            return
        }

        // How far the mouse has been moved
        // TODO : Handle touch event
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY

        let resizerContainer = resizer.parentNode
        let boundingClientRect = resizerContainer.getBoundingClientRect()
        let containerHeight = boundingClientRect.height
        let containerWidth = boundingClientRect.width

        switch (direction) {
            case "vertical":
                // @ts-ignore
                const ph = pxToPercent(prevSiblingHeight + deltaY, containerHeight)
                const nh = pxToPercent(nextSiblingHeight - deltaY, containerHeight)

                prevSibling.style.height = `${ph}%`
                nextSibling.style.height = `${nh}%`
                break
            case "horizontal": {
                // @ts-ignore
                const pw = pxToPercent(prevSiblingWidth + deltaX, containerWidth)
                const nw = pxToPercent(nextSiblingWidth - deltaX, containerWidth)

                prevSibling.style.width = `${pw}%`
                nextSibling.style.width = `${nw}%`
                // console.info(`message: "Mouse move : ${pw}  : ${nw}"`)
                break
            }
        }

        // Fix flickering issue
        resizer.style.cursor = cursor// 'col-resize';
        document.body.style.cursor = cursor //'col-resize';

        prevSibling.style.userSelect = "none"
        prevSibling.style.pointerEvents = "none"

        nextSibling.style.userSelect = "none"
        nextSibling.style.pointerEvents = "none"
    }

    const horizontalContainer = (
        <HorizontalDiv
            ref={resizerRef}
            onMouseDown={handleMouseDown}>
        </HorizontalDiv>
    )

    const verticalContainer = (
        <VerticalDiv
            style={{}}
            ref={resizerRef}
            onMouseDown={handleMouseDown}>
        </VerticalDiv>
    )

    return direction === "horizontal" ? horizontalContainer : verticalContainer
}

/*
    Horizontal Split
      <div style={{display: "flex", width: "100%", height: "25%"}}>
            <div style={{display: "flex", width: "50%", minWidth: "200px"}}>Left</div>
            <ResizableDivider direction="horizontal" />
            <div style={{display: "flex", width: "50%", minWidth: "200px"}}>Right</div>
      </div>
 */