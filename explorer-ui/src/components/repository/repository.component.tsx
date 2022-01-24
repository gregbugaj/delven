import React from 'react';
import "../globalServices"

function RepositoryComponent({
                               isVisible,
                               label
                           }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`TerminalComponent visible : ${isVisible} : [${label}]`)

    return (
        <div>Terminal component</div>
    );
}

export default React.memo(RepositoryComponent);