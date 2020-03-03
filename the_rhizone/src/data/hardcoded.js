/* Hard-coded data bellow
 * Example import:
 *     import * as Data from './../../data/hardcoded.js';
 * Usage "Data.userData"
 */

/*
 *      key: userName
 *      value: {password:'', isAdmin: false}
 */
const userData = new Map();
userData.set('user', {password:'user', isAdmin: false});
userData.set('user1', {password:'user1', isAdmin: false});
userData.set('user2', {password:'user2', isAdmin: false});
userData.set('user3', {password:'user3', isAdmin: false});
userData.set('user4', {password:'user4', isAdmin: false});
userData.set('admin', {password:'admin', isAdmin: true});

/*
 *      key: userName
 *      value: {newActivity:[],oldActivity:[]}
 */
const inboxData = new Map();
inboxData.set('user', {newActivity:[3,4], oldActivity:[5], pastPosts:[0,1,2,6,8,9]});
inboxData.set('user1', {newActivity:[],oldActivity:[], pastPosts:[3]});
inboxData.set('user2', {newActivity:[],oldActivity:[], pastPosts:[4, 13]});
inboxData.set('user3', {newActivity:[6],oldActivity:[], pastPosts:[5, 10]});
inboxData.set('user4', {newActivity:[],oldActivity:[], pastPosts:[11]});
inboxData.set('admin', {newActivity:[],oldActivity: [], pastPosts:[7, 12]});


/*
 * feel free to modify for thread messages
 * testing thread id 0-7
 * rest of the threads are just placeholders for the main page
 */

/*
 *      key: threadId,
 *      value: {pid:-1, author:"", replies[],
 *              content:{title:"", body:"", imgRef:""}}]
 */
const threadData = new Map ();
threadData.set(0, {pid:-1, author:"user", replies: [],
        content:{
            title: "Does RhiZone agree with Adorno?",
            body: "Ultimately in the essay The Culture Industry in the Dialectics of Enlightenments, Adorno claims all works of popular culture can never be art. Do you agree or disagree?",
            imgRef: "",
        }
    });
threadData.set(1, {pid:-1, author:"user", replies: [],
        content:{
            title: "What is your opinion of Ida?",
            body: "2014's Ida for me is one of the best films of the decade. It is a look into post-Holocaust Poland, exploring the angst, anxiety and loss of direction that comes from an event we cannot make sense of.",
            imgRef: "1.jpg",
        }
    });
threadData.set(2, {pid:-1, author:"user", replies: [3,4,5],
        content:{
            title: "Ida is a dissapointment",
            body: "I expected a lot out of this film given all the hype around it, but I found it rather pretentious in its execution and on-the-nose in its messaging. ",
            imgRef: "1.jpg",
        }
    });
threadData.set(3, {pid:2, author:"user1", replies: [],
        content:{
            title: "",
            body: "You fundamentally misunderstand the movie. @1 gets it. But Pawlikowski is continuing on his work which contemplates the movement image and its dialectical relationship with the time image here.",
            imgRef: "",
        }
    });
threadData.set(4, {pid:2, author:"user2", replies: [],
        content:{
            title: "",
            body: "Look at this shot. Just contemplate it. See how it positions Ida off-centered from the Christ statue. In the very first frame of the film, the film communicates Ida's psychological state without saying a word. That's why the film is genius.",
            imgRef: "firstframeofida.png",
        }
    });
threadData.set(5, {pid:2, author:"user3", replies: [6],
        content:{
            title: "",
            body: "If I could deescalate this discussion, I just want to add that when I left the movie theatre after seeing Ida, I walked back home looking like pic related.",
            imgRef: "leorangeman.jpg",
        }
    });
threadData.set(6, {pid:5, author:"user", replies: [],
        content:{
            title: "",
            body: "Can I save this image? I know this is off-topic, but seriously, that expression the orange guy has communicates something which conjures some strange existential affect inside my very being.",
            imgRef: "leorangeman.jpg",
        }
    });
    // Question: should admin message be the same or different from regular user postings
threadData.set(7, {pid:-1, author:"admin", replies: [],
        content:{
            title: "Hi I'm the Admin for RhiZone",
            body: "I'm making this post to introduce myself as an admin at RhiZone. Keep discussions civil and I won't ban you. Keep it smart too. If you can't keep it smart then at least try to be funny.",
            imgRef: "",
        }
    });
threadData.set(8, {pid:-1, author:"user", replies: [],
        content:{
            title: "The Beach Boy's Smile!",
            body: "I'm sure we all know the story behind The Beach Boy's Smile and how it resulted in Brian Wilson's breakdown. The follow up to Pet Sounds, what people often cite as the greatest album of all time, is astonishing in its own right. You can see the descent into madness in the album. Anyways, anyone who hasn't heard this one just has to.",
            imgRef: "smile.jpg",
        }
    });
threadData.set(9, {pid:-1, author:"user", replies: [],
        content:{
            title: "Tolkein Apperciation Thread",
            body: "It's really just incredible how much world-building is put into the LOTR series. What I am interested in is what RhiZone thinks of the suspected influence of romanticism on Tolkein's vision. pic related: it's some watercolors of Tolkein's world, given life.",
            imgRef: "hobbit.jpg",
        }
    });
 threadData.set(10, {pid:-1, author:"user3", replies: [],
        content:{
            title: "Great Quote from Great Gatsby",
            body: "For a moment the last sunshine fell with romantic affection upon her glowing face; her voice compelled me forward breathlessly as I listened — then the glow faded, each light deserting her with lingering regret, like children leaving a pleasant street at dusk.",
            imgRef: "gatsby.jpg",
        }
    });
 threadData.set(11, {pid:-1, author:"user4", replies: [],
        content:{
            title: "Best David Bowie Album?",
            body: "What does RhiZone think is the best David Bowie album? I like his Berlin trilogy (Low, Heroes, Station to Station). Actually I think Heroes is his best album because it combines the krautrock influence from Low, but also mantains the more melodic poppy elements from Hunky Dory, so to me it is the perfect balance of Bowie as an experimental pop musican. I know many of you like Blackstar given its apocolyptic air. But let's talk.",
            imgRef: "bowie.jpg",
        }
    });
threadData.set(12, {pid:-1, author:"admin", replies: [],
        content:{
            title: "Quotes Thread",
            body: "Just a thread to share some profound quotes: mines is from David Foster Wallace: \n \n \n \n 'It now lately sometimes seemed like a kind of black miracle to me that people could actually care deeply about a subject or pursuit, and could go on caring this way for years on end. Could dedicate their entire lives to it. It seemed admirable and at the same time pathetic. We are all dying to give our lives away to something, maybe. God or Satan, politics or grammar, topology or philately- the object seemed incidental to this will to give oneself away, utterly. To games or needles, to some other person. Something pathetic about it. A flight-from in the form of a plunging-into. Flight from exactly what? These rooms blandly filled with excrement and meat? To what purpose? This was why they started us here so young: to give ourselves away before the age when the questions why and to what grow real beaks and claws. It was kind, in a way. Modern German is better equipped for combining gerundives and prepositions than is its mongrel cousin. The original sense of addiction involved being bound over, dedicated, either legally or spiritually. To devote one's life, plunge in. I had researched this. Stice had asked whether I believed in ghosts. It's always seemed a little preposterous that Hamlet, for all his paralyzing doubt about everything, never once doubts the reality of the ghost. Never questions whether his own madness might not in fact be unfeigned. Stice had promised something boggling to look at. That is, whether Hamlet might be only feigning feigning.'",
            imgRef: "",
        }
    });
 threadData.set(13, {pid:-1, author:"user2", replies: [],
        content:{
            title: "Tree of Life Apperciation Thread",
            body: "Malick's 2011 'The Tree of Life' is the best movie of the decade. I know Cahier du Cinema didn't put it on their top 10 films of the decade list, but they're super wrong about that. Every shot in 'The Tree of Life' is mythopoetic, expressing moments of deep spirituality amongst the banality of the everyday. Malick is making a claim: one finds the most extreme beauty in the mundane, and then proving the claim with Lubezski's cinematography.",
            imgRef: "TheTreeofLife5.jpg",
        }
    });

export {userData,inboxData,threadData};
