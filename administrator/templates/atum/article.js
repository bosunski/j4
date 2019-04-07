let currentArticle = Joomla.getOptions('seo').article;

String.prototype.visualLength = function()
{
	let ruler = document.getElementById("titleRuler");
	ruler.innerHtml = this;
	return ruler.offsetWidth;
};

document.addEventListener("DOMContentLoaded",
	(e) => new Vue({
		el: "#seo",
		data() {
			return {
				article: currentArticle || {},
				titlePixelLength: 0,
				descriptionPixelLength: 0,
				titleRuler: null,
				descriptionRuler: null,
				mounted: false,
				author: null
				// originalArticleTitle: this.article.title || null
			}
		},
		computed: {
			comp() {
				let a = this.$refs['titleRuler'];
				a.innerText = this.articleTitle;
				return a.offsetWidth;
			},
			dateCreated() {
				return this.article.created ? (new Date(this.article.created)).toLocaleDateString() :  (new Date()).toLocaleDateString();
			},
			articleTitle: {
				get() {
					if (this.article.ogpg.seo_title) {
						return this.article.ogpg.seo_title;
					}

					return null;
				},
				set(newValue) {
					this.article.ogpg.seo_title = newValue;
				}
			},
			articleDescription: {
				get() {
					if (this.article.ogpg.seo_description && this.article.ogpg.seo_description !== "") {
						return this.article.ogpg.seo_description;
					}

					return this.article.metadesc;
				},
				set(newValue) {
					this.article.ogpg.seo_description = newValue;
				}
			},
			titleBarActiveClass() {
					if (this.titlePixelLength >= 500 && this.titlePixelLength < 607) return 'progress-bar-yellow';
					if (this.titlePixelLength >= 500 && this.titlePixelLength >= 607) return 'progress-bar-red';
					return 'progress-bar-blue';
			},
			descriptionBarActiveClass() {
				if (this.descriptionPixelLength >= 500 && this.descriptionPixelLength < 607) return 'progress-bar-yellow';
				if (this.descriptionPixelLength >= 500 && this.descriptionPixelLength >= 607) return 'progress-bar-red';
				return 'progress-bar-blue';
			}
		},
		watch: {
			articleTitle(newValue) {
				this.computePixelLengthFroTitle(newValue);
			},
			articleDescription(newValue) {
				this.computePixelLengthFroDescription(newValue);
			}
		},
		methods: {
			computePixelLengthFroTitle(newValue = null) {
				let ruler = this.$refs.titleRuler;
				ruler.innerHTML = newValue || this.articleTitle;
				this.titlePixelLength = ruler.offsetWidth > 0 ? ruler.offsetWidth : this.articleTitle.length;
			},
			computePixelLengthFroDescription(newValue) {
				let ruler = this.$refs.descriptionRuler;
				ruler.innerText = newValue || this.articleDescription;
				this.descriptionPixelLength = ruler.offsetWidth;
			}
		},
		mounted() {
			this.titleRuler = this.$refs.titleRuler;
			this.titleRuler.innerHTML = this.articleTitle;
			this.titlePixelLength = this.titleRuler.offsetWidth;
			this.descriptionRuler = this.$refs.descriptionRuler;
			this.mounted = true;
		}
	})
);
