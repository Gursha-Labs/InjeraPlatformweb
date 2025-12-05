import type { User } from "./user";

export type Category = {
  id: string;
  name: string;
};
export type AdVideo = {
  id: string;
  advertiser: User;
  title: string;
  description: string;
  duration: number;
  video_url: string;
  view_count: number;
  comment_count: number;
  category: Category;
  tags: string[];
  is_active: boolean;
};

/*
{
    "data": [
        {
            "id": "3aef343d-2ded-4657-9c4d-3ae18715f72c",
            "title": "dont",
            "video_url": "ads/1764872486_2SQQygnX2W.mp4",
            "advertiser_id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
            "category_id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
            "view_count": 0,
            "comment_count": 0,
            "duration": 28,
            "created_at": "2025-12-04T18:21:31.000000Z",
            "advertiser": {
                "id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
                "username": "naol527",
                "\"profile_picture\"": "profile_picture"
            },
            "category": {
                "id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
                "name": "Entertainment"
            },
            "tags": [
                {
                    "id": "255e059c-bc08-43a0-9c2c-6c61146e6374",
                    "name": "mmnmanma",
                    "pivot": {
                        "video_id": "3aef343d-2ded-4657-9c4d-3ae18715f72c",
                        "tag_id": "255e059c-bc08-43a0-9c2c-6c61146e6374"
                    }
                }
            ],
            "comments": []
        },
        {
            "id": "0327fa77-ef79-4859-9b38-fc0b2248d657",
            "title": "dont",
            "video_url": "ads/1764872475_y1qkqnExAU.mp4",
            "advertiser_id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
            "category_id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
            "view_count": 0,
            "comment_count": 0,
            "duration": 28,
            "created_at": "2025-12-04T18:21:22.000000Z",
            "advertiser": {
                "id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
                "username": "naol527",
                "\"profile_picture\"": "profile_picture"
            },
            "category": {
                "id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
                "name": "Entertainment"
            },
            "tags": [
                {
                    "id": "255e059c-bc08-43a0-9c2c-6c61146e6374",
                    "name": "mmnmanma",
                    "pivot": {
                        "video_id": "0327fa77-ef79-4859-9b38-fc0b2248d657",
                        "tag_id": "255e059c-bc08-43a0-9c2c-6c61146e6374"
                    }
                }
            ],
            "comments": []
        },
        {
            "id": "d18ec50d-5e40-4dab-b3ed-a435862126be",
            "title": "dont",
            "video_url": "ads/1764872243_agCcKHvvU9.mp4",
            "advertiser_id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
            "category_id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
            "view_count": 0,
            "comment_count": 0,
            "duration": 28,
            "created_at": "2025-12-04T18:17:43.000000Z",
            "advertiser": {
                "id": "16cb0527-7f65-42a1-8fdf-afc2c4c1aea0",
                "username": "naol527",
                "\"profile_picture\"": "profile_picture"
            },
            "category": {
                "id": "3b55c135-9aef-408e-99ee-c5ebb465ff1b",
                "name": "Entertainment"
            },
            "tags": [
                {
                    "id": "255e059c-bc08-43a0-9c2c-6c61146e6374",
                    "name": "mmnmanma",
                    "pivot": {
                        "video_id": "d18ec50d-5e40-4dab-b3ed-a435862126be",
                        "tag_id": "255e059c-bc08-43a0-9c2c-6c61146e6374"
                    }
                }
            ],
            "comments": []
        }
    ],
    "next_cursor": null,
    "has_more": false
} */
