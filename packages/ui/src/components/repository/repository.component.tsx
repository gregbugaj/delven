import React from 'react';
import "../globalServices"

function RepositoryComponent({
                               isVisible,
                               label
                           }: React.PropsWithChildren<{ isVisible: boolean, label: string }>) {

    console.info(`RepositoryComponent visible : ${isVisible} : [${label}]`)

    return (
        <div>Repository component</div>
    );
}

export default React.memo(RepositoryComponent);