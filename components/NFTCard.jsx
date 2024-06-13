import { useEffect, useState } from 'react'
import { BiHeart } from 'react-icons/bi'

import Router from 'next/router'

import { Card, Button, Row, Col, Divider, Empty, Layout, Space, Typography } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link'

const style = {
  wrapper: `bg-[#303339] flex-auto w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
}

const NFTCard = ({ nftItem, title, listings }) => {
  const [isListed, setIsListed] = useState(false)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const listing = listings.find((listing) => listing.asset.id === nftItem.id)

    console.log('listings.find((listing) => listing.asset.id === nftItem.id)')
    console.log({ listing })

    if (Boolean(listing)) {
      setIsListed(true)

      console.log("listing", { listing })

      setPrice(listing.buyoutCurrencyValuePerToken.displayValue)
    }
  }, [listings, nftItem])

  const { Content } = Layout;
  const { Meta } = Card;
  const { Title, Text } = Typography;

  return (
    <>
      <Link href={`/nfts/${nftItem.id}`}>
        <Card
          style={{ width: "100%" }}
          cover={
            <img
              alt="example"
              src={nftItem.image}
            />
          }>
          <Title level={2}>R$ {price}</Title>
          <Meta title={nftItem.name} description={nftItem.description} />
        </Card>
      </Link>
    </>
  )
}

export default NFTCard
