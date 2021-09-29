import Skeleington from '@mui/material/Skeleton';

import './SkeletonListItem.css';

const SkeletonListItem = () => {
    return(
        <div className="skeleton-list-item">
            <div className="skeleton-list-item-img-container">
                <Skeleington animation="wave" variant="circular" width={48} height={48}/>
            </div>

            <div className="skeleton-list-item-text-container">
                <Skeleington animation="wave" variant="text"/>
                <Skeleington animation="wave" variant="text" width={"70%"}/>
            </div>
        </div>
    )
}

export default SkeletonListItem;