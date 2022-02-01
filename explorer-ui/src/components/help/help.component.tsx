import React from 'react';
import "../globalServices"

function HelpComponent({
                               isVisible,
                               label
                           }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`HelpComponent visible : ${isVisible} : [${label}]`)

    return (
        <div>Help component</div>
    );
}

export default React.memo(HelpComponent);