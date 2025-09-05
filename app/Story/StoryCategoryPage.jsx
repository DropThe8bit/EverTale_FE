import React, { useState } from 'react';
import { useLocation } from 'react-router';

import "~/styles/storyCategory.css";


export default function storyCategoryPage() {
	const location = useLocation();
	const characterData = location.state?.character; // state 객체에서 character 데이터 추출

	// 이제 characterData를 이 페이지에서 자유롭게 사용할 수 있습니다.
	console.log('넘겨받은 캐릭터 데이터:', characterData);

	return (
		<>
			<div className="story-category-container">
				{characterData && <p>{characterData.name}이와 어떤 신나는 이야기를 만들어볼까?</p>}
				<div className='story-category-separator'></div>
				
				<div className="story-category-group">
					<div className="category-item">
						<img src="/images/category_adventure.png" alt="category_adventure"></img>
					</div>
					<div className="category-item">
						<img src="/images/category_friendship.png" alt="category_friendship"></img>
					</div>
					<div className="category-item">
						<img src="/images/category_moral.png" alt="category_moral"></img>
					</div>
					<div className="category-item">
						<img src="/images/category_family.png" alt="category_family"></img>
					</div>
				</div>

				<textarea
						name="description"

						placeholder="첫 장면에 대해서 설명해주세요. ex) 용이 몬스터를 향해 불을 내뿜고 있다."
					/>

			</div>

		</>
	)

}

