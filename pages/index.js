import Head from 'next/head'
import { Box, Grid, Stack, Text } from '@chakra-ui/react'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())
const space_api =
  'https://test.spaceflightnewsapi.net/api/v2/articles?_limit=100'

const Article = ({ title, summary, publishedAt }) => {
  const date = new Date(publishedAt).toLocaleDateString()
  const time = new Date(publishedAt).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  })

  return (
    <Box boxShadow="md">
      <Stack spacing={4} p={5} h="full" justify="space-between" bg="#f6f7f1">
        <Box>
          <Text fontSize="xl" fontWeight="medium" pb={3}>
            {title}
          </Text>
          <Text fontSize="xs">{summary}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" textAlign="right" color="gray.500">
            {`${date} | ${time}`}
          </Text>
        </Box>
      </Stack>
    </Box>
  )
}

const sortByLaunches = (articles) => {
  let launchesArticle = articles.filter((item) => item.launches.length > 0)
  let nonLaunchesArticle = articles.filter((item) => item.launches.length === 0)

  // Sort based on Launches ID
  launchesArticle.sort((a, b) => {
    if (a.launches.length > 0 && b.launches.length > 0) {
      return a.launches[0].id.localeCompare(b.launches[0].id)
    } else {
      return 0
    }
  })

  return [...nonLaunchesArticle, ...launchesArticle]
}

const Home = ({ articles }) => {
  const { data } = useSWR(space_api, fetcher, { initialData: articles })
  let sortedArticles = sortByLaunches(data)

  return (
    <div>
      <Head>
        <title>🚀 Spaces Article</title>
      </Head>

      <Box p={9} bg="#f5d0c8">
        <Text fontWeight="bold" fontSize="3xl">
          🚀 Spaces Article
        </Text>
      </Box>

      <Box flex p={8} bg="#e8ebe4">
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']} gap={6}>
          {sortedArticles.map((item) => (
            <Article
              title={item.title}
              summary={item.summary}
              publishedAt={item.publishedAt}
            />
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default Home

export async function getStaticProps() {
  const articles = await fetcher(space_api)
  return { props: { articles } }
}
