/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Task, MangaPage, Reviewer } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: 'Neon Drifters',
    description: 'A high-octane cyberpunk epic set in the sprawling megalopolis of Neo-Tokyo 2099.',
    status: 'PLANNING',
    updatedAt: '2h ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwgZzoGXSfPWNZrJ2f7CVPJgUhC3aTIuWSUtcLCyoMSCw54xUmjjEVbxfKL6QOZznPWDRU45sCB62Ljcf3bR6dDGqt0zw2XBldyOBSi_w8vPFHcWFVBkkqXJ6c6U6sBhJg37OLFI5q67jljhgrywUJPSXOXY0TpA6dwMiJ5AoaZNxXDW6ZWZvOcayahGKHalAMLE4-21tzkd1QEy9CWOnMaWd5fagHbHqlS6A3WEkl7Xvbw_gM6uSg3orhlgsSdKg7clvLuSn3jU',
    category: 'Drafts'
  },
  {
    id: 'proj_2',
    name: 'Petals of the Ronin',
    description: 'A wandering swordsman seeks redemption in an era of blooming cherry blossoms and blood.',
    status: 'IN_PROGRESS',
    updatedAt: 'yesterday',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZ5H6b9D7U07ssAIYfzkVnrMluHwcbH51Nfx4TaDw7xxN2LTpc5SNB88rDXngfa55FuhWESOG38CaZxaRFFPdOITDxhKLgO293LpaJXaj21EffapqkxfDrcRBYh4bhgsGBUpsTIXigzyg-UdCzYW9Dt6weXdWx2IfzXbq6C3BaY1v_vLccT9BnsftI_ZflgCYV5Y7aBs1OBOtHoZDgsF3g-oD9jfHX1gASlsVI0yLsOcNKoczCZsYlGOrFjqLCKbGyWqZi9WUuw',
    category: 'Drafts'
  },
  {
    id: 'proj_3',
    name: 'Astral Archive',
    description: 'Collectors of forgotten cosmic memories travel through the threads of time.',
    status: 'COMPLETED',
    updatedAt: '3 days ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuP5lT-5_wREqApQjP6NudW1DGH3o6rq-zrS2GpsUnt5lKFYwTNMGuKSxlDgS_i_D-PzkL8oC0Oh1Z4MCsOzgsJtox6na7EUb9HbxE0wW4pneenzITo-DyYAwtn0XKcCZyY_iqVQrwjSuHPNFb-ItipyzWB-OOQWfMS6nUbHJG_GspBRDhEzxd_rm9LATfur8Z2GKoirCwasHa4HyQm5VHVgNA3ABJuNNiTEPgWVxJu5ZwuMQG_WXN2obZy692khnMyg-bjZjlq44',
    category: 'Published'
  },
  {
    id: 'proj_4',
    name: 'Midnight Coffee',
    description: 'A story about unexpected connections found in a 24-hour cafe.',
    status: 'IN_PROGRESS',
    updatedAt: '1 week ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrH7rxVAcri1Q_O3CzoOLTH5Ij7BdpM85n7wk0oy8JRi59_sHWPCklrwaTzQ4-0Ib7QxaSfv4hFAhODvqtImLQn6XrPNMOHeaxrAnZ0wWW6kcM9zHNlleqlqH8-43ytkUYwFinCG3AFvnDkesuXIrJ3RiLT0_hGMhHeXh63tY3pvCtY61zMeglwxhgMoVZFB_rXq03aQU1KLpyeToRo3G9_HrzT7FnvE7r3rJ_E-Mn0LSsszcnQ6o7teKfGpk5jLQwkDVeWOr4MXk',
    category: 'Drafts'
  },
  {
    id: 'proj_5',
    name: 'Ember Reign',
    description: 'The last dragon rider must reclaim the throne from the volcanic legions.',
    status: 'PLANNING',
    updatedAt: '2 weeks ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzOEvFnCJDnzWh6PsZXE4aO_rA0Pph7Z1lBWXnkxf9XwonresEuDRH0Dz32wu2o3CmiJUMVaf-C67NKIN627WmO9YhnS_6-eKhEJDCjpnLoxTHRcdIkSCn7e0VIfyY2RUDpj1E1uadm0eN4vYlS27H-A1MzEzT05OOlO6lgWxZsrb4YTIlW5IwI80-Sz1K7LdMYwDKlSKUru0q8BBkdKaW8hiPKHk-DF475RBk1qFi5N9Iw67syDVlUQjVNosuwvs_-CYoIvhzAg',
    category: 'Drafts'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    projectId: 'proj_2', // Petals of the Ronin
    title: 'Forest Temple Sketch',
    description: 'Draft the interior of the ancient temple for Chapter 42, focus on lighting from ceiling cracks.',
    column: 'TODO',
    tag: 'Backgrounds',
    priority: 'Medium',
    dueDate: '2d left',
    assignees: [
      {
        name: 'Mika Sato',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDclkyrL7wFDm6Qr_EK9HTLIxB3uAjI4G2USFyNYtMdTdrKi_i5y6xpvaSUtQvPrbFtytQpB8j88AK05x_nkQ-XyM3T52jZ27I3gXpXXt3i7Z5lBEz-TOSSmOMbqIjVP2Z_YsVts-Bfg4B0RBRbxUynQzewuA4tDtZDWgstHBLIa9Kw4HkaFLW7kIFCiSu3_N8EFQnMolDGnN7M9u6UHLMXqXM4AYit-hA-a1rM87cuda_YuHcIGbEsEtjzDysGT61e-K_dV7BINQA'
      }
    ]
  },
  {
    id: 'task_2',
    projectId: 'proj_2', // Petals of the Ronin
    title: 'Dialogue Layout Ch. 41',
    description: 'Arrange speech bubbles for the climax scene between Ryu and Kael. High tension focus.',
    column: 'TODO',
    tag: 'Drafting',
    priority: 'Urgent',
    dueDate: 'Urgent',
    assignees: [
      {
        name: 'Haru Art',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMPYWG9O5Kue7Pmsbf2v_sUB6o8SwR8kjiBPwe9lYI_4H4Qy2QGCD5hcyZHBCddQSdHvJWDW36kLW1edvkOpi6HvA1tkj09V1eoBLaICZCNFFUJlBjr64upU7d8Huq6MNSmA54UAYcyx5GtNhD0D-x0ixi8AJryKeH5i-JXTW3PEWXkW9F9i70NL1_z5f_0HrCbvGEniuJQblqadmXVtvaU93NYJeqIVJvJmmlP7CMMrG4q7vWPj2HFiHN0FAEt4NylgSf6wNzmY'
      }
    ]
  },
  {
    id: 'task_3',
    projectId: 'proj_2', // Petals of the Ronin
    title: 'Main Battle Sequence',
    description: 'Inking pages 12-18. Focus on dynamic motion lines and high contrast ink wash.',
    column: 'IN_PROGRESS',
    tag: 'Inking',
    priority: 'Medium',
    dueDate: 'Ongoing',
    assignees: [
      {
        name: 'Mika Sato',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfsjOZ9DcXDoMbQ2mGZkeCiTX-4wCiEckBPJ1UhnjW9TxcvveZi97o0CrQ4S58Vnay5LyZieR_dUWyuHvMJw1e9hbejBaG8Rcb0P2V5aWYVOjALDNb0CzaBWyb5pOOv_J0VZYMmuhPkOomuw_lXpWuM8oGXzDWrs6UFA0TpaZwTCUoEcYJclDjEMDJHD6MeX4LpAGfCtN652oodbkn4ElJN5VOu8_oqtKkC0SWXNWj_YTicW3QJFXu8zkRIN4NrOXjoOFY4f-JmY0'
      },
      {
        name: 'Jun Tanaka',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARnqAr_XxVAGjUz6av3mvDkctlxGbVPspJLWvrLSICFexKnjrT3K5B5pyaD0sIjX7h7JPTj2O-X4zemBukUYrdeDjYsK9JgemWQoIx7_bVdGrJ7iKufGeIMy1uAvcOIXmu6-VXs7_0l2litdgfxDd11a7yKBI5MJzMcP051uncu65zUHqQog1tq3c5X_uzBD6QibvNGdFbkrCAipHFsjl1wCnvKm-FG24ABYY3zd-XZtbWkBEqvotbvkqdYSIXagLmp9ZXEbdFDlM'
      }
    ]
  },
  {
    id: 'task_4',
    projectId: 'proj_2', // Petals of the Ronin
    title: 'Cover Art V2',
    description: 'Final render of the Volume 4 cover. Check color balance and logo placement for print.',
    column: 'REVIEW',
    tag: 'Editing',
    priority: 'Low',
    dueDate: 'Needs Review',
    assignees: [
      {
        name: 'Kaito Hoshino',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnu5NBpZXx6kJ-sAlQYP-XGmO-3tjT6akdWauskW5wLx4a7CVWRM4gb6CWXA6Gl7kVOQrMLwbc_0b_f23XMLZdAu9-ApNPXRmYCWnUY9H9rSI0eJ1IDYXXUIaNUm-IbxPaQoqlOhquAlNNgTjiIZPjS_5bU_PItnhc5_HAi-E0n_qD3MDjgZKqOl8jG9oNHT7hMvQyd6ZEH5b-aBWiNNiiN36zQt973UvlkfKFz2QLiD7AYPFcOnaXcir5peOxouxcJRjR4BDilCQ'
      }
    ]
  },
  {
    id: 'task_5',
    projectId: 'proj_2', // Petals of the Ronin
    title: 'Chapter 41 Script Final',
    description: 'Finalized script and panel descriptions for the entire chapter.',
    column: 'DONE',
    tag: 'Script',
    priority: 'Low',
    dueDate: 'Completed Jun 12',
    assignees: [
      {
        name: 'Lead Writer',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkm9YDesZa_L_unATtB1oKxrc-V9VdcfcTODBDIe6Ivr_5Um3s0M41iJtrjgqY3xcGrmxCjyytu-tvGI7LX17i3VDQ5VYnmqhjHa5reA_YNbEwAexv9hQlzUjmPiPcoKIVRNNWXvwfy7KEhvwJTZ0O91QQZ1822makKOGv_pGBVdpcyZS6P2Kc0em4sKxYlg2uia9isg4iY4aIjgUfsEg7k2AFczeGCD_rMj7Y9BxXoeZd7Dgvfdm0KzNUhlYAzXWk32xVhU6pvRA'
      }
    ]
  }
];

export const INITIAL_PAGES: MangaPage[] = [
  {
    id: 'page_1',
    projectId: 'proj_2', // Petals of the Ronin / The Last Ronin
    fileName: 'P01_Inking_Final.psd',
    pageNumber: 1,
    status: 'Pending',
    uploadedAt: '2h ago',
    uploader: '@Haru_Art',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYi4G_ECVEGcRKTi1_ESt8bUQuRGAPsXwV6noaZ91JAYMqJbug_ln-l5s_rnYkozK4wIJgYOiEqS-1qFyXcjN3GQHamFSO1hO3I6Mlsv37ecFxzQ5jtbvqNOOVBBYUMQZhqIGzKCEZ9eh3jOOE16mhgBRPCvO_boj4ArvrPcJXhHCTwLVW6gEI0Wuc3zcWiTLyxEWffGaYEcvKtQXTBkR2ZOWF1i3R79LFZeQVahlr-eIk7Cz3cmHW6TPqQZeQLMOYqRCPFZN9-AM',
    feedbacks: []
  },
  {
    id: 'page_2',
    projectId: 'proj_2',
    fileName: 'P02_Main_Action.tif',
    pageNumber: 2,
    status: 'Approved',
    uploadedAt: '4h ago',
    uploader: '@Haru_Art',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI6hc85HpiUJGnoOJJ1OfCGmiCxc3uvTkmfPREwFrxAqRSMEW4Pl8VTMfjKflbeOmzND8h0vvd_m1MR0rTYREEikvLAvNvtBToK0-vlF7azkcKTOy64R4Vo4cOKJmv1HcxwfYumQFDRZ81q2zWd_0k7L7YRd181Wb5YUmXS3r5HF5Day2ffc8gdwyAq1uPajy1fI0FChaGOi6aJLFbwg8gYeEhEuyROjZUYjBR4SBQUpcu6TqCbCHUnKZ7hcIVPqB2z-zpLYy5RbI',
    feedbacks: [
      {
        id: 'fb_1',
        user: 'Kaito Hoshino',
        role: 'Lead Editor',
        comment: 'Brilliant action and flow! Approved for final screentone layer.',
        createdAt: '3h ago'
      }
    ]
  },
  {
    id: 'page_3',
    projectId: 'proj_2',
    fileName: 'P03_Background_V2.png',
    pageNumber: 3,
    status: 'Revision',
    note: 'Fix lighting on panels 3 & 4',
    uploadedAt: 'Yesterday',
    uploader: '@Haru_Art',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBssxkVGtJclQojUh6LYe3qyhYFBDMLgI6H4DgtgQizO7bAHsl_a-iSAFOlc_hSEowTS-cgIMUdq_Z7_hoDU0NnHLxAw3fNI_EQ-7wH9HdlC--Y11b6Van52qo71W4rKFlk-_d_Q6t4ruHCF53F8O646rioAgn5UAxzs5Tgrky79mL12uQZch3-KkmyZxfcraGKZmYBYSbRP7530T8PjGxRkMgODPE3sYb0NZ2nc9wKkx_r4FhvWJ0rSDP3lIQHa25somskqfK29Yw',
    feedbacks: [
      {
        id: 'fb_2',
        user: 'Jun Tanaka',
        role: 'QC Specialist',
        comment: 'Please fix the lighting on panels 3 & 4. It is too dark relative to the cyber moon.',
        createdAt: '1d ago',
        x: 40,
        y: 65
      }
    ]
  },
  {
    id: 'page_4',
    projectId: 'proj_2',
    fileName: 'P04_Emotive_Dialogue.psd',
    pageNumber: 4,
    status: 'Pending',
    uploadedAt: '5h ago',
    uploader: '@Haru_Art',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlm9X574kLWic8_pze4FBiRQndBpkHokdEvM-pM4WDGyZ5sy_Jo119ixjz-GD8gJJZ5Qfnc4uO5bqS1b7Rp71aTbrqkrW1h4Mzs0nci6BjnLmUaJUf8LZuqGmXWIQOxhUc79HjSSLvZGM8qcpzU4PCRYpxMYgUv_OpIUoQvSiY7jm0tIVpGc6MUYgemx-rtbsFQHdBK_win5KXOMpl1wVpG3eCoqhvlB1Ah6XVD0z51qt3sLo5_Olpej5og5rbTTdiuX7OjcyIEzY',
    feedbacks: []
  }
];

export const INITIAL_REVIEWERS: Reviewer[] = [
  {
    id: 'rev_1',
    name: 'Kaito Hoshino',
    role: 'Lead Editor',
    initials: 'KH',
    color: 'bg-primary-container/50 text-primary',
    status: 'online'
  },
  {
    id: 'rev_2',
    name: 'Mika Sato',
    role: 'Artist',
    initials: 'MS',
    color: 'bg-secondary-container/50 text-secondary',
    status: 'online'
  },
  {
    id: 'rev_3',
    name: 'Jun Tanaka',
    role: 'QC Specialist',
    initials: 'JT',
    color: 'bg-tertiary-container/50 text-tertiary',
    status: 'away'
  }
];

export const READER_PAGES = [
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmJHrq5SKyI_ufOTILAWrLDYInfb1VarsShFdhczHD-vvSQXQQz_B8RAiTt1Z_siPj_5I5TnuQcIe3LE_DQHO6InnIZhcj4K-yCET5js25ow8finzm_lDRtVXtFNEADUhc4ckK_XtbmVKM4AnnlPPWDgZoVL8SXLq_lnPgFmPWl5CeT9iLn_YCpbDFPaakYIPsdtVAC78oMwn_SsA-RBNgWVH2RoO_dUAcb3Y_96NRha09vQsfnHmO_05d0B8n86GaRsMj7N13cZQ',
    num: 1,
    desc: 'Neon Tokyo under the cyberpunk moon'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh5uDSImp5XxU44zI181XKCn7_3WM9KC6MxkKPqQj5pyHowgQXiZfd1wndpk8bmbqfoZ9KxTFNfDH1967OURUkQc5xIa4Mrfl9YBnvka1641SEpL8MdkuM1UJ40m-l5uj4CKkGhGAvl7haW0smcPCeRRQTBQk148dMDSnkhLkfpfyA9GQo-jfOHkFAE-XF3j_jdf_tsAtUghubFvZ0o8T70LlzJe5DgYiYoDwS_xihfVt6VRepRR4JAzpAi-AFC6v67WpnvhwI9X8',
    num: 2,
    desc: 'Protagonist with glowing cybernetic eyes'
  },
  {
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW39aYd8MHp4fg3sqzTeGXO_0EHPWJ8GGlKSnGFoafJpbF7ZJg19RD9RzQzzPeN1SRo2QkoSYsGbQ3jPI1KNOYcZ7irt7WcgVgeeI2QFn6BrtLQDffrg-To7On_5RZZpA0NuAY4o_L05-6n3gDhrzI7XxS3m7EL6YX0ndojJiMf6sN_OvZrhfMj9psz1-lafv_4g5qTO9AyFWSCdJQAX-Cq8DKE_pyFtacm9GjuJp1wUURtLFdqxVnHqWagUyPE6S1Ysic5oww3wM',
    num: 3,
    desc: 'High-speed action chase scene'
  }
];
