
import { Card, Image } from 'antd';

const HeroCollection = ({bannerImageUrl}) => {

    return (
        <>
        <Card
            cover={ <Image
            width="100%"
            height="400px"
            src={
                bannerImageUrl
            }
            />
        }
            bordered={false}
            style={{ textAlign: 'center' }}
        >
            <Card.Meta
            title="Título do Banner 1"
            description="Descrição do Banner 1"
            />
        </Card>
        </>
    )
      
}

export default HeroCollection