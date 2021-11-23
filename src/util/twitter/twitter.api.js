import { get } from './httpClient'
const END_POINT = '/twitter'

const getUsersByUsernames = (usernames) => {
    const res = get(`${END_POINT}/get_id`, { usernames: usernames })
    return res
}

const getUserTweetTimelineById = (userId) => {
    const data = get(`${END_POINT}/get_tweets`, {
        uid: userId,
    })
    return data
}

async function getTwitList(usernames) {
    const usersId = await getUsersByUsernames(usernames)
    const twitList = []
    for (const user of usersId.data.data) {
        const twitListItem = await getUserTweetTimelineById(user.id)
        twitListItem.data.data.forEach((el) => {
            twitList.push({
                ...el,
                name: twitListItem.data.includes.users[0].username,
                avatar: twitListItem.data.includes.users[0].profile_image_url,
            })
        })
    }

    return twitList.sort(function (a, b) {
        var c = new Date(a.created_at)
        var d = new Date(b.created_at)
        return d - c
    })
}

export { getUsersByUsernames, getUserTweetTimelineById, getTwitList }
