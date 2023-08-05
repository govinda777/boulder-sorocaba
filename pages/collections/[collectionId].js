//https://eth-goerli.g.alchemy.com/v2/gGROFEeQljyl-uydYbSNjDijaCIG248y

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'
import { Card, Avatar, Divider, Typography, Row, Col, Image, Statistic } from 'antd';
  import { InstagramOutlined, TwitterOutlined, MoreOutlined, GlobalOutlined } from '@ant-design/icons';
  

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {
  const router = useRouter()
  const { provider } = useWeb3()
  const { collectionId } = router.query
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner()
    )
    return sdk.getNFTModule(collectionId)
  }, [provider])

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()

      setNfts(nfts)
    })()
  }, [nftModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(
      provider.getSigner()
    )
    return sdk.getMarketplaceModule(
      '0x43a77C79dE0c6481D63FA2803287432C9EA86cb5'
    )
  }, [provider])

  // get all listings in the collection
  useEffect(() => {

    console.log("get all listings in the collection")

    if (!marketPlaceModule) return
    ;(async () => {
        console.log("setListings(await marketPlaceModule.getAllListings())")
        const result = await marketPlaceModule.getAllListings()
        console.log("console.log({result})")
        console.log({result})
      setListings(result)
    })()
  }, [marketPlaceModule])

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    if(collectionData && collectionData.length > 0) {        
        await setCollection(collectionData[0])
    }

  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  
  const { Title, Text } = Typography;
  
  return (
    <div>
      <Header />
      <Row justify="center">
        <Image
          width="100%"
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
        />
      </Row>
      <Row justify="center">
        <Avatar
          size={160}
          src={
            collection?.imageUrl
              ? collection.imageUrl
              : 'https://via.placeholder.com/200'
          }
        />
      </Row>
      <Row justify="center">
        <Card style={{ width: 300, marginTop: 16 }} bordered={false}>
          <GlobalOutlined />
          <Divider type="vertical" />
          <InstagramOutlined />
          <Divider type="vertical" />
          <TwitterOutlined />
          <Divider type="vertical" />
          <MoreOutlined />
        </Card>
      </Row>
      <Row justify="center">
        <Title level={1}>{collection?.title}</Title>
      </Row>
      <Row justify="center">
        <Text>Created by <Text type="secondary">{collection?.creator}</Text></Text>
      </Row>
      <Row justify="center">
        <Card style={{ width: 300, marginTop: 16 }} bordered={false}>
          <Row justify="space-between">
            <Col>
              <Statistic title="Items" value={nfts.length} />
            </Col>
            <Col>
              <Statistic title="Owners" value={collection?.allOwners ? collection.allOwners.length : ''} />
            </Col>
            <Col>
              <Statistic title="Floor Price" value={collection?.floorPrice} prefix={<img src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth" />} />
            </Col>
            <Col>
              <Statistic title="Volume Traded" value={collection?.volumeTraded} prefix={<img src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg" alt="eth" />} />
            </Col>
          </Row>
        </Card>
      </Row>
      <Row justify="center">
        <Text>{collection?.description}</Text>
      </Row>
      <Row justify="center" gutter={16}>
        {nfts.map((nftItem, id) => (
          <Col span={8}>
            <NFTCard
              key={id}
              nftItem={nftItem}
              title={collection?.title}
              listings={listings}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
  
}

export default Collection
