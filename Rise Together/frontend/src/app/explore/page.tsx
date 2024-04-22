import dynamic from 'next/dynamic'
import React from 'react'

const CampaignCard = dynamic(() => import('./Explore'), { ssr: false })


const page = () => {
  return (
    <div><CampaignCard /></div>
  )
}

export default page