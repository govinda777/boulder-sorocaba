//https://eth-goerli.g.alchemy.com/v2/gGROFEeQljyl-uydYbSNjDijaCIG248y

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import NFTCard from '../../components/NFTCard'
import { Card, Divider, Typography, Row, Col, Image, Statistic, Avatar, Meta } from 'antd';
import { InstagramOutlined, TwitterOutlined, MoreOutlined, GlobalOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import HeroCollection from '../../components/HeroCollection'

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

    if (!marketPlaceModule) return
    ;(async () => {
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
    
    const collectionZero = collectionData[0];

    console.log({collectionZero})
    if(collectionData && collectionData.length > 0) {        
        await setCollection(collectionZero)
    }
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  const { Title, Text } = Typography;

  const bannerImageUrl = collection?.bannerImageUrl
  ? collection.bannerImageUrl
  : 'https://via.placeholder.com/200';

  return (
    <>
      <HeroCollection bannerImageUrl={bannerImageUrl}/>
      <Avatar
          size={160}
          src={
            collection?.imageUrl
              ? collection.imageUrl
              : 'https://via.placeholder.com/200'
          }
        />
        <Title level={1}>{collection?.title}</Title>
        <Row justify="center">
        <Card style={{ width: 300, marginTop: 16 }} bordered={false}>
          <Row justify="space-between">
            <Col>
              <Statistic title="Items" value={nfts.length} />
            </Col>
            <Col>
              <Statistic title="Owners" value={collection?.allOwners ? collection.allOwners.length : ''} />
            </Col>
          </Row>
        </Card>
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
    </>
  );
  
}

/*
      <Header />

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
*/

export default Collection
