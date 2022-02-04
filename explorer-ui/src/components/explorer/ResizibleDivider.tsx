import React from 'react'

// ref : https://htmldom.dev/create-resizable-split-views/
export default function ResizibleDivider(props: {direction: "vertical" | "horizontal", containerARef?: string | undefined, containerBRef?: string | undefined}) {

    const {direction, containerARef, containerBRef} = props
    const resizerRef = React.createRef<HTMLDivElement>();
    const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';

    console.info("refs ")
    console.info(containerARef)
    console.info(containerBRef)

    // The current position of mouse
    let x = 0;
    let y = 0;

    let prevSiblingWidth = 0;
    let prevSiblingHeight = 0;

    const handleMouseDown = (event) => {
        const resizer = resizerRef.current;

        if (resizer === null) {
            return
        }

        const prevSibling = resizer.previousElementSibling as HTMLDivElement;
        // Get the current mouse position
        x = event.clientX;
        y = event.clientY;

        const rect = prevSibling.getBoundingClientRect()
        prevSiblingWidth = rect.width;
        prevSiblingHeight = rect.height;

        // Attach the listeners to `document`
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseUp = (event) => {

        const resizer = resizerRef.current;
        if (resizer === null) {
            return
        }

        const prevSibling = resizer.previousElementSibling as HTMLDivElement;
        const nextSibling = resizer.nextElementSibling as HTMLDivElement;
        console.info('message: "Mouse UP"')

        console.info("refs ")
        console.info(containerARef)
        console.info(containerBRef)

        // resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        resizer.style.cursor = cursor

        prevSibling.style.removeProperty('user-select');
        prevSibling.style.removeProperty('pointer-events');

        nextSibling.style.removeProperty('user-select');
        nextSibling.style.removeProperty('pointer-events');

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (event) => {
        // console.info('message: "Mouse Move"')
        const resizer = resizerRef.current;
        if (resizer === null) {
            return
        }
        const prevSibling = resizer.previousElementSibling as HTMLDivElement;
        const nextSibling = resizer.nextElementSibling as HTMLDivElement;

        // How far the mouse has been moved
        const dx = event.clientX - x;
        const dy = event.clientY - y;

        if (resizer.parentNode == null) {
            return
        }

        switch (direction) {
            case 'vertical':
                // @ts-ignore
                const h = (prevSiblingHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height;
                prevSibling.style.height = `${h}%`;
                break;
            case 'horizontal':
                // @ts-ignore
                const w = (prevSiblingWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width;
                prevSibling.style.width = `${w}%`;
                break;
        }

        // Fix flickering issue
        resizer.style.cursor = cursor;// 'col-resize';
        document.body.style.cursor = cursor; //'col-resize';

        prevSibling.style.userSelect = 'none';
        prevSibling.style.pointerEvents = 'none';

        nextSibling.style.userSelect = 'none';
        nextSibling.style.pointerEvents = 'none';
    }

    //"#cbd5e0"
    const horizontalContainer = (
        <div
            style={{border: "0px solid red", cursor: cursor, backgroundColor: "#000", width: '4px', height: '100%'}}
            ref={resizerRef}
            onMouseDown={handleMouseDown}>
        </div>
    )

    const verticalContainer = (
        <div
            style={{border: "0px solid red", cursor: cursor, backgroundColor: "#cbd5e0", width: '100%', height: '4px'}}
            ref={resizerRef}
            onMouseDown={handleMouseDown}>
        </div>
    )

    return direction === 'horizontal' ? horizontalContainer : verticalContainer
}
