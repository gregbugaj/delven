import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { EuiPanel, EuiCode, EuiSpacer } from '@elastic/eui';

import {EuiText, EuiResizableContainer} from '@elastic/eui';
import ResizibleDivider from "../explorer/ResizibleDivider";

function Stage({
                   children,
                   label,
               }: React.PropsWithChildren<{ label: string }>) {
    const classes = classNames("euiComponent", "content-stage");

    return (
        <>
        <div style={{display: "flex", height: '100px', border: "2px solid blue", minWidth:'200px'}}>
            <div style={{display: "flex", width: "50%"}}>Left</div>
            <ResizibleDivider direction="horizontal"/>
            <div style={{display: "flex", flex: "1 1 0%", border: "2px solid pink"}}>Right</div>
        </div>

            <div>
                <div  style={{display: "flex", width: "50%"}}>
                    LHS
                </div>

                <div   style={{display: "flex", flex: "1 1 0%", border: "2px solid pink"}}>
                    RHS
                </div>

            </div>
        </>


        // <EuiResizableContainer>
        //     {(EuiResizablePanel, EuiResizableButton) => (
        //         <>
        //             <EuiResizablePanel initialSize={50} minSize="200px">
        //                 <div className={classes}>
        //                     Content Window Panel<br/>
        //                     RenderTime : {Date.now()}
        //                 </div>
        //
        //             </EuiResizablePanel>
        //
        //             <EuiResizableButton/>
        //
        //             <EuiResizablePanel initialSize={50} minSize="200px">
        //               Right Panel
        //             </EuiResizablePanel>
        //         </>
        //     )}
        // </EuiResizableContainer>

    );
}

Stage.propTypes = {
    className: PropTypes.string
};

export default React.memo(Stage);