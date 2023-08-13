
import { Card, Image, Avatar, Typography } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';


const HeroCollection = ({ collection }) => {

    const { Title, Text } = Typography;
    const { Meta } = Card;

    return (
        <>
            <Card
                style={{
                    width: '100%',
                    height: '500px'
                }}
                cover={
                    <Image
                    width="100%"
                    height="300px"
                    src={
                        collection.bannerImageUrl
                    }
                />
                }
            >
                <Meta
                    avatar={
                    <Avatar
                        size={150}
                        src={
                          collection?.imageUrl
                            ? collection.imageUrl
                            : 'https://via.placeholder.com/200'
                        }
                      />}
                    title={<Title level={1}>{collection?.title}</Title>}
                    description={collection?.description}
                />
            </Card>
        </>
    )

}

export default HeroCollection