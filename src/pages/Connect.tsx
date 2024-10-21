import useURLParams from '@/hooks/useURLParams'
import useKaspa from '@/hooks/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'

const Connect: React.FC = () => {
  const { request } = useKaspa()
  const [hash, params] = useURLParams()

  return (
    <>
      <AnimatedMain>
        <Header title="Connect" showBackButton={false} />
        <div className="px-6">
          <p className="text-warning text-base font-lato text-center pt-6 pb-32">
            This website is requesting access to your wallet.
          </p>
          <p className="text-base text-primarytext font-lato text-center pt-6 pb-32">
            {params.get('url')!}
          </p>
        </div>
        <div className="fixed bottom-0 left-0 w-full px-6 pb-10">
          <button
            type="button"
            onClick={() => {
              request('provider:connect', [params.get('url')!]).then(() => {
                window.close()
              })
            }}
            className="w-full h-[52px] text-base font-lato font-semibold rounded-[25px] bg-primary text-secondarytext cursor-pointer hover:bg-hover"
          >
            Connect
          </button>
      </div>
      </AnimatedMain>
    </>
  )
}

export default Connect