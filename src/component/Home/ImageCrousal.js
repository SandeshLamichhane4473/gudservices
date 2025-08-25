import React from 'react'
import image1 from '../../images/image1.jpg'
export default function ImageCrousal() {
    return (
        <div style={{ backgroundImage: `url(${image1})` }}>
            <img src={image1} />
        </div>
    )
}
