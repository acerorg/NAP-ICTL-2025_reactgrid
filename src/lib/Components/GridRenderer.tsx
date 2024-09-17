import React, { useImperativeHandle  } from 'react';
import { GridRendererProps } from '../Model/InternalModel';
import { HiddenElement } from './HiddenElement';
import { ErrorBoundary } from './ErrorBoundary';
import { useReactGridState } from './StateProvider';
import { isBrowserFirefox } from '../Functions/firefox';
import { KeyboardEvent, PointerEvent, ClipboardEvent, FocusEvent } from '../Model/domEventsTypes';

type KeyboardEventHandler = (event: KeyboardEvent) => void;
type PointerEventHandler = (event: PointerEvent) => void;
type ClipboardEventHandler = (event: ClipboardEvent) => void;
type BlurEventHandler = (event: FocusEvent) => void;

export interface KeyboardEvents {
    keyDown: KeyboardEventHandler,
    onKeyUp: KeyboardEventHandler,
    onCompositionEnd: KeyboardEventHandler,
    onPointerDown: PointerEventHandler,
    onPasteCapture: ClipboardEventHandler,
    onPaste: ClipboardEventHandler,
    onCopy: ClipboardEventHandler,
    onCut: ClipboardEventHandler,
    onBlur: BlurEventHandler,
}

const GridRendererInternal = (
    { eventHandlers, children }: GridRendererProps & { children: React.ReactChild },
    ref: React.ForwardedRef<KeyboardEvents>,
) => {
    const { cellMatrix, props } = useReactGridState();
    const sharedStyles = {
        width: props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
        height: cellMatrix.height,
    };

    useImperativeHandle(ref, () => ({
        keyDown: eventHandlers.keyDownHandler,
        onKeyUp: eventHandlers.keyUpHandler,
        onCompositionEnd: eventHandlers.compositionEndHandler as any,
        onPointerDown: eventHandlers.pointerDownHandler,
        onPasteCapture: eventHandlers.pasteCaptureHandler,
        onPaste: eventHandlers.pasteHandler,
        onCopy: eventHandlers.copyHandler,
        onCut: eventHandlers.cutHandler,
        onBlur: eventHandlers.blurHandler,
    }), [eventHandlers]);

    return (
        <ErrorBoundary>
            <div
                className="reactgrid"
                style={{
                    position: 'relative',
                    paddingRight: isBrowserFirefox() ? "10px" : "",
                    ...sharedStyles,
                }}
                ref={eventHandlers.reactgridRefHandler}
            >
                <div
                    className="reactgrid-content"
                    onKeyDown={eventHandlers.keyDownHandler}
                    onKeyUp={eventHandlers.keyUpHandler}
                    onCompositionEnd={eventHandlers.compositionEndHandler as any}
                    onPointerDown={eventHandlers.pointerDownHandler}
                    onPasteCapture={eventHandlers.pasteCaptureHandler}
                    onPaste={eventHandlers.pasteHandler}
                    onCopy={eventHandlers.copyHandler}
                    onCut={eventHandlers.cutHandler}
                    onBlur={eventHandlers.blurHandler}
                    style={sharedStyles}
                >
                    {children}
                    <HiddenElement hiddenElementRefHandler={eventHandlers.hiddenElementRefHandler} />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export const GridRenderer = React.forwardRef(GridRendererInternal);