//https://eth-goerli.g.alchemy.com/v2/gGROFEeQljyl-uydYbSNjDijaCIG248y

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../../lib/sanityClient'
import { ThirdwebSDK } from '@3rdweb/sdk'
import Header from '../../components/Header'
import NFTCard from '../../components/NFTCard'
import { Card, Divider, Typography, Row, Col, Image, Statistic, Avatar, Meta, Layout, Space } from 'antd';
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
      ; (async () => {
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
      ; (async () => {
        const result = await marketPlaceModule.getAllListings()
        console.log("console.log({result})")
        console.log({ result })
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

    console.log({ collectionZero })
    if (collectionData && collectionData.length > 0) {
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

  const { Footer, Sider, Content } = Layout;

  const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
  };

  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
  };

  const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
  };

  const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
  };

  return (
    <>
      <Header />
      <Layout>
        <Sider style={siderStyle}>Sider</Sider>
        <Layout>
          <Content style={contentStyle}>
            <HeroCollection collection={collection} />
            <Row justify="center">
              <Card style={{ width: 300, marginTop: 16 }} >
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

          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default Collection
